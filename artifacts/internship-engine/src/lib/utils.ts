import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function getScoreColor(score: number) {
  if (score >= 75) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 50) return "text-amber-600 dark:text-amber-400";
  return "text-red-500 dark:text-red-400";
}

export function getScoreBg(score: number) {
  if (score >= 75) return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400";
  if (score >= 50) return "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400";
  return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400";
}

export function getDomainColor(domain: string) {
  const colors: Record<string, string> = {
    "Web Development": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    "AI/ML": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    "Data Science": "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
    "Mobile Development": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
    "Cloud/DevOps": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    "Cybersecurity": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    "Blockchain": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    "Game Development": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  };
  return colors[domain] ?? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
}

const INDIAN_CITIES = [
  "bangalore", "bengaluru", "mumbai", "delhi", "new delhi", "hyderabad", "chennai", "pune", 
  "ahmedabad", "gurgaon", "noida", "kolkata", "jaipur", "india"
];

export function isIndianLocation(location: string = "") {
  if (!location) return false;
  const loc = location.toLowerCase();
  return INDIAN_CITIES.some(city => loc.includes(city));
}

export function formatCurrency(amount: string | number, location: string = "") {
  if (amount == null || amount === "") return "Competitive";
  const amountStr = String(amount);
  const cleanAmount = amountStr.replace(/[₹$]/g, "").trim();
  
  if (isIndianLocation(location)) {
    return `₹${cleanAmount}`;
  }
  return `$${cleanAmount}`;
}
