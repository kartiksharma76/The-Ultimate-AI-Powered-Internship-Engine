import { db, internshipsTable } from "../lib/db/src/index";

const SAMPLE_INTERNSHIPS = [
  { 
    title: "Frontend Developer Intern", 
    company: "Meta", 
    domain: "Web Development", 
    location: "Remote", 
    requiredSkills: ["React", "TypeScript", "Tailwind"], 
    description: "Work on the next generation of social interfaces.", 
    duration: "6 Months", 
    stipend: "80k", 
    salaryRange: "70-90k", 
    applicationDeadline: "2024-12-01", 
    popularity: 95 
  },
  { 
    title: "HR Operations Intern", 
    company: "Google", 
    domain: "HR & Operations", 
    location: "Bangalore", 
    requiredSkills: ["Communication", "Excel", "People Management"], 
    description: "Help us build a better workplace.", 
    duration: "3 Months", 
    stipend: "30k", 
    salaryRange: "25-35k", 
    applicationDeadline: "2024-11-15", 
    popularity: 88 
  },
  { 
    title: "Product Design Intern", 
    company: "Airbnb", 
    domain: "UI/UX Design", 
    location: "Remote", 
    requiredSkills: ["Figma", "User Research", "Prototyping"], 
    description: "Design experiences for global travelers.", 
    duration: "4 Months", 
    stipend: "65k", 
    salaryRange: "60-70k", 
    applicationDeadline: "2024-12-15", 
    popularity: 92 
  },
  { 
    title: "Data Analyst Intern", 
    company: "Amazon", 
    domain: "Data Science", 
    location: "Hyderabad", 
    requiredSkills: ["SQL", "Python", "Tableau"], 
    description: "Derive insights from massive datasets.", 
    duration: "6 Months", 
    stipend: "45k", 
    salaryRange: "40-50k", 
    applicationDeadline: "2024-11-30", 
    popularity: 85 
  },
  { 
    title: "Marketing Associate Intern", 
    company: "Netflix", 
    domain: "Digital Marketing", 
    location: "Mumbai", 
    requiredSkills: ["Social Media", "SEO", "Analytics"], 
    description: "Grow our audience engagement.", 
    duration: "3 Months", 
    stipend: "25k", 
    salaryRange: "20-30k", 
    applicationDeadline: "2024-11-10", 
    popularity: 78 
  },
  { 
    title: "Backend Engineer Intern", 
    company: "Uber", 
    domain: "Backend Development", 
    location: "Remote", 
    requiredSkills: ["Go", "Distributed Systems", "PostgreSQL"], 
    description: "Scale our real-time logistics engine.", 
    duration: "6 Months", 
    stipend: "75k", 
    salaryRange: "70-80k", 
    applicationDeadline: "2024-12-20", 
    popularity: 90 
  },
  { 
    title: "Financial Analyst Intern", 
    company: "Goldman Sachs", 
    domain: "Finance", 
    location: "Bangalore", 
    requiredSkills: ["Financial Modeling", "Excel", "VBA"], 
    description: "Analyze market trends and risk.", 
    duration: "6 Months", 
    stipend: "50k", 
    salaryRange: "45-55k", 
    applicationDeadline: "2024-12-05", 
    popularity: 82 
  }
];

async function seed() {
  console.log("Seeding internships...");
  try {
    for (const internship of SAMPLE_INTERNSHIPS) {
      await db.insert(internshipsTable).values(internship as any);
    }
    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
