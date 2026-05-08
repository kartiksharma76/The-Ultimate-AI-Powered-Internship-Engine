import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  useListStudents,
  useCreateStudent,
  useUpdateStudent,
} from "@workspace/api-client-react";
import { useActiveStudent, setActiveStudent } from "@/components/Layout";
import { cn } from "@/lib/utils";
import { 
  User, Mail, MapPin, Briefcase, Info, Sparkles, Plus, X, 
  BrainCircuit, Target, Check, GraduationCap, FolderCode, 
  History, Link as LinkIcon, Calendar, Trash2, Save
} from "lucide-react";

const DOMAINS = [
  "Web Development", "Frontend Development", "Backend Development", "Full Stack Development",
  "AI/ML", "Data Science", "Data Analytics", "Mobile Development", 
  "Cloud/DevOps", "Cybersecurity", "Blockchain", "Game Development",
  "UI/UX Design", "Product Management", "Quality Assurance (QA)",
  "Digital Marketing", "Content Writing", "HR & Operations", 
  "Sales & Business Development", "Finance", "Embedded Systems",
  "AR/VR Development", "Network Engineering"
];
const LEVELS = ["beginner", "intermediate", "advanced"] as const;

function SkillTag({ skill, onRemove }: { skill: string; onRemove: () => void }) {
  return (
    <motion.span 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl border border-primary/20"
    >
      {skill}
      <button type="button" onClick={onRemove} className="hover:text-foreground transition-colors ml-0.5"><X className="w-3 h-3" /></button>
    </motion.span>
  );
}

interface FormValues {
  name: string;
  email: string;
  experienceLevel: "beginner" | "intermediate" | "advanced";
  location: string;
  bio: string;
  careerGoals: string;
}

export default function ProfilePage() {
  const studentId = useActiveStudent();
  const { data: students, refetch } = useListStudents();
  const student = students?.find(s => s.id === studentId);

  const [skills, setSkills] = useState<string[]>([]);
  const [domains, setDomains] = useState<string[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [experience, setExperience] = useState<any[]>([]);
  
  const [skillInput, setSkillInput] = useState("");
  const [isNew, setIsNew] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>();

  useEffect(() => {
    if (student) {
      reset({
        name: student.name,
        email: student.email,
        experienceLevel: student.experienceLevel as "beginner" | "intermediate" | "advanced",
        location: student.location,
        bio: student.bio ?? "",
        careerGoals: student.careerGoals ?? "",
      });
      setSkills(student.skills || []);
      setDomains(student.domains || []);
      setEducation((student as any).education || []);
      setProjects((student as any).projects || []);
      setExperience((student as any).experience || []);
      setIsNew(false);
    } else {
      setIsNew(true);
    }
  }, [student, reset]);

  const { mutate: create, isPending: creating } = useCreateStudent();
  const { mutate: update, isPending: updating } = useUpdateStudent();

  const isPending = creating || updating;

  function addSkill() {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) {
      setSkills([...skills, s]);
    }
    setSkillInput("");
  }

  function addEducation() {
    setEducation([...education, { school: "", degree: "", year: "" }]);
  }

  function addProject() {
    setProjects([...projects, { title: "", description: "", link: "" }]);
  }

  function addExperience() {
    setExperience([...experience, { company: "", role: "", duration: "" }]);
  }

  function onSubmit(data: FormValues) {
    // Auto-add pending skill if any
    let finalSkills = [...skills];
    const pendingSkill = skillInput.trim();
    if (pendingSkill && !finalSkills.includes(pendingSkill)) {
      finalSkills.push(pendingSkill);
      setSkills(finalSkills);
      setSkillInput("");
    }

    if (finalSkills.length === 0) {
      toast.error("Add at least one skill");
      return;
    }
    if (domains.length === 0) {
      toast.error("Select at least one domain");
      return;
    }

    const payload = { 
      ...data, 
      skills: finalSkills, 
      domains, 
      education, 
      projects, 
      experience 
    };

    if (isNew || !student) {
      create({ data: payload as any }, {
        onSuccess: (s) => {
          toast.success("Profile created!");
          setActiveStudent(s.id);
          refetch();
          window.location.reload();
        },
        onError: () => toast.error("Failed to create profile. Email may already exist.")
      });
    } else {
      update({ id: studentId, data: payload as any }, {
        onSuccess: () => {
          toast.success("Profile updated!");
          refetch();
        },
        onError: () => toast.error("Failed to update profile.")
      });
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 relative">
      <div className="fixed inset-0 pointer-events-none opacity-[0.2] mesh-gradient -z-10" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-xl shadow-primary/20">
            {student?.name ? (
              <span className="text-3xl font-black">{student.name[0]}</span>
            ) : (
              <User className="w-10 h-10" />
            )}
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-2">{isNew ? "Establish Profile" : "Refine Identity"}</h1>
            <p className="text-muted-foreground font-medium italic text-xs uppercase tracking-widest font-black">
              Sync Active
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="submit"
            form="profile-form"
            disabled={isPending}
            className="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-[1.25rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            {isPending ? <BrainCircuit className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Profile
          </button>
        </div>
      </div>

      <form id="profile-form" onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          {/* Base Parameters */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-[2.5rem] p-10">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground mb-8 flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" />
              Base Parameters
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/70 ml-2">Display Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    {...register("name", { required: "Name is required" })}
                    className="w-full pl-12 pr-4 py-4 rounded-[1.25rem] border border-border/50 bg-muted/20 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    placeholder="Full Name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/70 ml-2">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    {...register("email", { required: "Email is required" })}
                    type="email"
                    className="w-full pl-12 pr-4 py-4 rounded-[1.25rem] border border-border/50 bg-muted/20 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    placeholder="you@domain.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/70 ml-2">Base Location</label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    {...register("location", { required: "Location is required" })}
                    className="w-full pl-12 pr-4 py-4 rounded-[1.25rem] border border-border/50 bg-muted/20 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    placeholder="City, Country"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/70 ml-2">Career Seniority</label>
                <div className="relative group">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <select
                    {...register("experienceLevel")}
                    className="w-full pl-12 pr-4 py-4 rounded-[1.25rem] border border-border/50 bg-muted/20 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none"
                  >
                    {LEVELS.map(l => (
                      <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Education Matrix */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-[2.5rem] p-10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-primary" />
                Education Details
              </h2>
              <button type="button" onClick={addEducation} className="p-2 hover:bg-primary/10 rounded-xl transition-colors">
                <Plus className="w-5 h-5 text-primary" />
              </button>
            </div>
            <div className="space-y-6">
              {education.map((edu, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-muted/10 rounded-3xl border border-border/50 relative group">
                  <button 
                    type="button" 
                    onClick={() => setEducation(education.filter((_, i) => i !== idx))}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-destructive text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <input
                    value={edu.school}
                    onChange={e => {
                      const newEdu = [...education];
                      newEdu[idx].school = e.target.value;
                      setEducation(newEdu);
                    }}
                    placeholder="University/School"
                    className="bg-transparent border-b border-border/50 py-2 text-sm font-bold outline-none focus:border-primary transition-colors"
                  />
                  <input
                    value={edu.degree}
                    onChange={e => {
                      const newEdu = [...education];
                      newEdu[idx].degree = e.target.value;
                      setEducation(newEdu);
                    }}
                    placeholder="Degree/Field"
                    className="bg-transparent border-b border-border/50 py-2 text-sm font-bold outline-none focus:border-primary transition-colors"
                  />
                  <input
                    value={edu.year}
                    onChange={e => {
                      const newEdu = [...education];
                      newEdu[idx].year = e.target.value;
                      setEducation(newEdu);
                    }}
                    placeholder="Year"
                    className="bg-transparent border-b border-border/50 py-2 text-sm font-bold outline-none focus:border-primary transition-colors"
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Project Portfolio */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-[2.5rem] p-10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-2">
                <FolderCode className="w-4 h-4 text-primary" />
                Key Projects
              </h2>
              <button type="button" onClick={addProject} className="p-2 hover:bg-primary/10 rounded-xl transition-colors">
                <Plus className="w-5 h-5 text-primary" />
              </button>
            </div>
            <div className="space-y-6">
              {projects.map((project, idx) => (
                <div key={idx} className="space-y-4 p-6 bg-muted/10 rounded-3xl border border-border/50 relative group">
                  <button 
                    type="button" 
                    onClick={() => setProjects(projects.filter((_, i) => i !== idx))}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-destructive text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      value={project.title}
                      onChange={e => {
                        const newProj = [...projects];
                        newProj[idx].title = e.target.value;
                        setProjects(newProj);
                      }}
                      placeholder="Project Title"
                      className="bg-transparent border-b border-border/50 py-2 text-sm font-bold outline-none focus:border-primary transition-colors"
                    />
                    <input
                      value={project.link}
                      onChange={e => {
                        const newProj = [...projects];
                        newProj[idx].link = e.target.value;
                        setProjects(newProj);
                      }}
                      placeholder="Link (Github/Demo)"
                      className="bg-transparent border-b border-border/50 py-2 text-sm font-bold outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <textarea
                    value={project.description}
                    onChange={e => {
                      const newProj = [...projects];
                      newProj[idx].description = e.target.value;
                      setProjects(newProj);
                    }}
                    placeholder="Project Description"
                    rows={2}
                    className="w-full bg-transparent border-b border-border/50 py-2 text-sm font-medium outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Work Experience */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-[2.5rem] p-10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-2">
                <History className="w-4 h-4 text-primary" />
                Work Experience
              </h2>
              <button type="button" onClick={addExperience} className="p-2 hover:bg-primary/10 rounded-xl transition-colors">
                <Plus className="w-5 h-5 text-primary" />
              </button>
            </div>
            <div className="space-y-6">
              {experience.map((exp, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-muted/10 rounded-3xl border border-border/50 relative group">
                  <button 
                    type="button" 
                    onClick={() => setExperience(experience.filter((_, i) => i !== idx))}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-destructive text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <input
                    value={exp.company}
                    onChange={e => {
                      const newExp = [...experience];
                      newExp[idx].company = e.target.value;
                      setExperience(newExp);
                    }}
                    placeholder="Company Name"
                    className="bg-transparent border-b border-border/50 py-2 text-sm font-bold outline-none focus:border-primary transition-colors"
                  />
                  <input
                    value={exp.role}
                    onChange={e => {
                      const newExp = [...experience];
                      newExp[idx].role = e.target.value;
                      setExperience(newExp);
                    }}
                    placeholder="Role/Position"
                    className="bg-transparent border-b border-border/50 py-2 text-sm font-bold outline-none focus:border-primary transition-colors"
                  />
                  <input
                    value={exp.duration}
                    onChange={e => {
                      const newExp = [...experience];
                      newExp[idx].duration = e.target.value;
                      setExperience(newExp);
                    }}
                    placeholder="Duration (e.g. 6 Months)"
                    className="bg-transparent border-b border-border/50 py-2 text-sm font-bold outline-none focus:border-primary transition-colors"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="space-y-8">
          {/* Skills & Domains */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card rounded-[2.5rem] p-8">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground mb-6 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Skill Matrix
            </h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
                  className="flex-1 px-4 py-3 rounded-xl border border-border/50 bg-muted/20 text-xs font-bold outline-none focus:border-primary transition-all"
                  placeholder="Type skill..."
                />
                <button 
                  type="button" 
                  onClick={addSkill}
                  className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase hover:bg-primary hover:text-white transition-all"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map(s => <SkillTag key={s} skill={s} onRemove={() => setSkills(skills.filter(x => x !== s))} />)}
              </div>
            </div>

            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground mt-10 mb-6 flex items-center gap-2">
              <Target className="w-4 h-4 text-accent" />
              Domains
            </h2>
            <div className="grid grid-cols-1 gap-2">
              {DOMAINS.map(domain => (
                <button
                  key={domain}
                  type="button"
                  onClick={() => setDomains(d => d.includes(domain) ? d.filter(x => x !== domain) : [...d, domain])}
                  className={cn(
                    "py-2.5 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest border-2 transition-all flex items-center justify-between",
                    domains.includes(domain) ? "border-primary bg-primary/10 text-primary" : "border-transparent bg-muted/20 text-muted-foreground"
                  )}
                >
                  {domain}
                  {domains.includes(domain) && <Check className="w-3 h-3" />}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card rounded-[2.5rem] p-8 bg-foreground text-background">
            <h3 className="text-xl font-black mb-4 italic">Finalize Sync?</h3>
            <p className="text-[10px] font-bold text-background/60 mb-8 uppercase tracking-widest leading-relaxed">Your professional parameters will be recalculated for AI placement optimization.</p>
            <button
              type="submit"
              form="profile-form"
              disabled={isPending}
              className="w-full py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isPending ? <BrainCircuit className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {isNew ? "Create Profile" : "Save Changes"}
            </button>
          </motion.div>
        </div>
      </form>
    </div>
  );
}
