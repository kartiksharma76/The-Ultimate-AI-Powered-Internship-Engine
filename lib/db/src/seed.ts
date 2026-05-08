import { db, studentsTable, internshipsTable } from "./index";

async function seed() {
  console.log("Seeding database...");

  // Clear existing data
  await db.delete(internshipsTable);
  await db.delete(studentsTable);

  // Seed Students
  await db.insert(studentsTable).values([
    {
      name: "Kartik Sharma",
      email: "kartik@example.com",
      skills: ["Java", "Spring Boot", "React", "SQL", "JavaScript", "Node.js"],
      domains: ["Web Development", "AI/ML", "Software Engineering"],
      experienceLevel: "beginner",
      location: "Delhi, India",
      bio: "Ambitious developer looking for growth opportunities.",
    },
    {
      name: "John Doe",
      email: "john@example.com",
      skills: ["Python", "Data Science", "Machine Learning", "R", "SQL"],
      domains: ["Data Science", "AI/ML"],
      experienceLevel: "intermediate",
      location: "Remote",
    }
  ]);

  // Seed Internships (Naukri-style)
  await db.insert(internshipsTable).values([
    {
      title: "React.js Developer Intern",
      company: "Tata Consultancy Services",
      domain: "Web Development",
      location: "Bengaluru, Karnataka",
      requiredSkills: ["React.js", "TypeScript", "JavaScript", "HTML", "CSS"],
      description: "Looking for motivated interns to join our React development team. You will work on building scalable user interfaces for global clients.",
      duration: "6 months",
      stipend: "₹25,000/month",
      experienceRange: "0-2 Yrs",
      salaryRange: "3-5 LPA",
      applicationDeadline: "2026-08-30",
      popularity: 88,
    },
    {
      title: "Software Engineer Trainee",
      company: "Infosys",
      domain: "Software Engineering",
      location: "Mysuru, Karnataka",
      requiredSkills: ["Java", "Spring Boot", "MySQL", "Hibernate"],
      description: "Join the Infosys training program. We are looking for fresh graduates with a strong foundation in Java and Oops concepts.",
      duration: "12 months",
      stipend: "₹30,000/month",
      experienceRange: "0-1 Yrs",
      salaryRange: "4-6 LPA",
      applicationDeadline: "2026-09-15",
      popularity: 92,
    },
    {
      title: "Data Analyst Intern",
      company: "Wipro",
      domain: "Data Science",
      location: "Hyderabad, Telangana",
      requiredSkills: ["Python", "SQL", "Tableau", "Excel", "PowerBI"],
      description: "Analyze large datasets to provide actionable insights for business stakeholders. Proficiency in SQL and Python is a must.",
      duration: "3 months",
      stipend: "₹15,000/month",
      experienceRange: "0-2 Yrs",
      salaryRange: "Not disclosed",
      applicationDeadline: "2026-07-20",
      popularity: 75,
    },
    {
      title: "Cloud Support Intern (AWS)",
      company: "Amazon Web Services",
      domain: "Cloud/DevOps",
      location: "Chennai, Tamil Nadu",
      requiredSkills: ["AWS", "Linux", "Networking", "Python"],
      description: "Support our global cloud infrastructure. You will learn about AWS services and how to troubleshoot complex cloud environments.",
      duration: "6 months",
      stipend: "₹45,000/month",
      experienceRange: "0-1 Yrs",
      salaryRange: "8-12 LPA",
      applicationDeadline: "2026-08-10",
      popularity: 98,
    },
    {
      title: "Backend Development Intern (Node.js)",
      company: "Zomato",
      domain: "Web Development",
      location: "Gurugram, Haryana",
      requiredSkills: ["Node.js", "Express", "MongoDB", "Redis"],
      description: "Help us build the next generation of food delivery systems. You will be responsible for building high-performance APIs.",
      duration: "6 months",
      stipend: "₹40,000/month",
      experienceRange: "0-2 Yrs",
      salaryRange: "6-10 LPA",
      applicationDeadline: "2026-07-30",
      popularity: 94,
    },
    {
      title: "Mobile App Developer Intern",
      company: "Flipkart",
      domain: "Mobile Development",
      location: "Bengaluru, Karnataka",
      requiredSkills: ["React Native", "JavaScript", "iOS", "Android"],
      description: "Build seamless shopping experiences for millions of users. Experience with React Native is highly preferred.",
      duration: "6 months",
      stipend: "₹35,000/month",
      experienceRange: "0-1 Yrs",
      salaryRange: "7-11 LPA",
      applicationDeadline: "2026-09-01",
      popularity: 91,
    }
  ]);

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
