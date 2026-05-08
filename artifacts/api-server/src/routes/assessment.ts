import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { assessmentsTable, studentsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

// Generate adaptive test questions
router.get("/assessments/generate", async (req, res) => {
  const { type, difficulty, studentId } = req.query;
  const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;

  try {
    let studentSkills = "None";
    if (studentId) {
      const [student] = await db.select().from(studentsTable).where(eq(studentsTable.id, parseInt(studentId as string)));
      if (student && student.skills) {
        studentSkills = student.skills.join(", ");
      }
    }

    if (NVIDIA_API_KEY && (type === "coding" || type === "mcq")) {
      const prompt = type === "coding" 
        ? `Generate a ${difficulty} level coding problem for an internship assessment. 
           The student has these skills: ${studentSkills}. 
           The problem should be relevant to their skills if possible, or a general data structures/algorithms problem.
           Return ONLY a JSON object with 'title', 'description', 'constraints', and 'exampleCases' (array).`
        : `Generate exactly 5 ${difficulty} level technical Multiple Choice Questions (MCQs) for a student with these skills: ${studentSkills}. 
           Return ONLY a valid JSON object with a 'questions' array. 
           Each item MUST have: 'id' (number), 'question' (string), 'options' (array of 4 strings), and 'correctIndex' (number 0-3).
           Do NOT include any markdown formatting or explanation outside the JSON.`;
      
      console.log(`[AI Assessment] Generating ${type} questions...`);

      const aiResponse = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${NVIDIA_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta/llama-3.1-8b-instruct",
          messages: [{ role: "system", content: "You are a technical interviewer. You output only pure JSON." }, { role: "user", content: prompt }],
          temperature: 0.1, // Lower temperature for more consistent JSON
        }),
      });

      if (aiResponse.ok) {
        const data = await aiResponse.json() as any;
        const aiText = data.choices[0]?.message?.content?.trim() ?? "{}";
        console.log(`[AI Assessment] Received response from AI.`);
        
        const jsonMatch = aiText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            const content = JSON.parse(jsonMatch[0]);
            console.log(`[AI Assessment] Successfully parsed ${type} content.`);
            return res.json(type === "coding" ? { problem: content } : { questions: content.questions });
          } catch (pErr) {
            console.error(`[AI Assessment] JSON Parse Error:`, pErr);
          }
        } else {
          console.warn(`[AI Assessment] No JSON found in AI response:`, aiText);
        }
      } else {
        console.error(`[AI Assessment] NVIDIA API Error:`, await aiResponse.text());
      }
    }
    
    // Fallback Mock Questions if AI fails
    if (type === "mcq") {
      return res.json({
        questions: [
          { id: 1, question: "What is the time complexity of searching in a Balanced Binary Search Tree?", options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], correctIndex: 1 },
          { id: 2, question: "Which protocol is primarily used for secure web communication?", options: ["FTP", "SMTP", "HTTP", "HTTPS"], correctIndex: 3 },
          { id: 3, question: "In React, which hook is used to handle side effects?", options: ["useState", "useMemo", "useEffect", "useCallback"], correctIndex: 2 },
          { id: 4, question: "What does SQL stand for?", options: ["Structured Question Language", "Strong Query Language", "Structured Query Language", "Simple Query Language"], correctIndex: 2 },
          { id: 5, question: "Which of these is NOT a NoSQL database?", options: ["MongoDB", "Redis", "Cassandra", "PostgreSQL"], correctIndex: 3 }
        ]
      });
    }

    res.json({
      problem: {
        title: "Two Sum",
        description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9"],
        exampleCases: [{ input: "nums = [2,7,11,15], target = 9", output: "[0,1]" }]
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate assessment" });
  }
});

// Submit Assessment
router.post("/assessments/submit", async (req, res) => {
  const { studentId, internshipId, type, timeTakenMinutes, fraudDetails, codeOutput } = req.body;
  
  try {
    // Advanced evaluation logic
    let finalScore = 0;
    if (type === "mcq") {
      finalScore = codeOutput?.score || 0;
    } else {
      finalScore = codeOutput?.passed ? 100 : 0;
    }
    
    let fraudFlag = 0;
    if (fraudDetails && (fraudDetails.browserSwitches > 3 || fraudDetails.copyPastes > 1)) {
      fraudFlag = 1; // suspicious
    }

    const [result] = await db.insert(assessmentsTable).values({
      studentId,
      internshipId: internshipId || null,
      type,
      difficulty: "adaptive",
      codingAccuracy: finalScore,
      totalScore: finalScore,
      timeTakenMinutes,
      fraudFlag,
      fraudDetails: fraudDetails || {},
      completedAt: new Date()
    });

    const [assessment] = await db.select().from(assessmentsTable).where(eq(assessmentsTable.id, result.insertId));
    
    // Connect to Gamification: Add XP based on score
    try {
      const { gamificationTable, studentsTable } = await import("@workspace/db/schema");
      const xpToAdd = Math.floor(finalScore * 10);
      
      const [stats] = await db.select().from(gamificationTable).where(eq(gamificationTable.studentId, studentId));
      if (stats) {
        const newXp = stats.xpPoints + xpToAdd;
        const newLevel = Math.floor(newXp / 1000) + 1;
        
        await db.update(gamificationTable)
          .set({ xpPoints: newXp, level: newLevel })
          .where(eq(gamificationTable.studentId, studentId));
          
        await db.update(studentsTable).set({ totalXp: newXp }).where(eq(studentsTable.id, studentId));
        console.log(`[Database Sync] Added ${xpToAdd} XP to student ${studentId}. New Total: ${newXp}`);
      }
    } catch (gamifyErr) {
      console.error("[Database Sync] Failed to update XP:", gamifyErr);
    }

    res.status(201).json(assessment);
  } catch (error) {
    res.status(500).json({ error: "Failed to submit assessment" });
  }
});

export default router;
