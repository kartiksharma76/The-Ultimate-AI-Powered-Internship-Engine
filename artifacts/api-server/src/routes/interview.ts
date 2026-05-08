import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { interviewsTable, studentsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

// Evaluate Interview Transcript
router.post("/interviews/evaluate", async (req, res) => {
  const { studentId, internshipId, transcript } = req.body;
  const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;

  try {
    let strengths = ["No strengths detected."];
    let weaknesses = ["Transcript was too short or AI failed to analyze."];
    let improvementSuggestions = "Please provide detailed answers using the STAR method.";
    let scores = { confidence: 0, communication: 0, technical: 0 }; // Default to 0 instead of 80 for strictness

    if (!transcript.includes("USER:") || transcript.split("USER:").join("").length < 200) {
      // Fast-fail: User didn't say anything or barely said anything
      strengths = [];
      weaknesses = ["Candidate abandoned the interview or provided practically zero response.", "Did not engage with the AI interviewer."];
      improvementSuggestions = "You must actually answer the questions. The interview was terminated due to lack of response.";
    } else if (NVIDIA_API_KEY && transcript) {
      const prompt = `You are a STRICT, elite-level technical recruiter evaluating an internship candidate's mock interview.
      You MUST be brutally honest and highly critical.
      
      Transcript: 
      """
      ${transcript.substring(0, 3000)}
      """
      
      CRITICAL EVALUATION RULES:
      1. If the candidate's answers are very short (e.g. "Hi", "I made a website"), their scores MUST be terrible (0-20).
      2. High scores (80+) should ONLY be given for detailed, structured answers (like using the STAR method).
      3. Deduct massive points for lack of technical depth or confidence.
      
      Return ONLY a JSON object with EXACTLY these fields:
      - 'strengths' (array of strings, keep it blank if the interview was terrible)
      - 'weaknesses' (array of strings, point out lack of detail, shortness, etc.)
      - 'improvementSuggestions' (string, strict actionable advice)
      - 'scores' (object with 'confidence', 'communication', 'technical' from 0-100)`;

      const aiResponse = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${NVIDIA_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta/llama-3.1-8b-instruct",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.5,
        }),
      });

      if (aiResponse.ok) {
        const data = await aiResponse.json() as any;
        const aiText = data.choices[0]?.message?.content?.trim() ?? "{}";
        const jsonMatch = aiText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            const analysis = JSON.parse(jsonMatch[0]);
            if (analysis.strengths) strengths = analysis.strengths;
            if (analysis.weaknesses) weaknesses = analysis.weaknesses;
            if (analysis.improvementSuggestions) improvementSuggestions = analysis.improvementSuggestions;
            
            // Handle both nested 'scores' object and flat score keys
            if (analysis.scores) {
              scores = analysis.scores;
            } else if (analysis.confidence !== undefined || analysis.technical !== undefined) {
              scores = {
                confidence: analysis.confidence || 0,
                communication: analysis.communication || 0,
                technical: analysis.technical || 0
              };
            }
          } catch (parseErr) {
            console.error("Failed to parse LLaMA JSON:", parseErr);
          }
        }
      }
    }

    const overallScore = (scores.confidence + scores.communication + scores.technical) / 3;

    const [result] = await db.insert(interviewsTable).values({
      studentId,
      internshipId: internshipId || null,
      overallScore,
      confidenceScore: scores.confidence,
      communicationScore: scores.communication,
      technicalScore: scores.technical,
      strengths,
      weaknesses,
      improvementSuggestions,
      transcript,
      completedAt: new Date()
    });

    const [interview] = await db.select().from(interviewsTable).where(eq(interviewsTable.id, result.insertId));
    res.status(201).json(interview);
  } catch (error) {
    res.status(500).json({ error: "Failed to evaluate interview" });
  }
});

export default router;
