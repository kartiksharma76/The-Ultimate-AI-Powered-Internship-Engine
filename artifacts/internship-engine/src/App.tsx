import { Switch, Route, useLocation, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import Layout from "@/components/Layout";
import HomePage from "@/pages/home";
import DashboardPage from "@/pages/dashboard";
import ProfilePage from "@/pages/profile";
import InternshipsPage from "@/pages/internships";
import InternshipDetailPage from "@/pages/internship-detail";
import RecommendationsPage from "@/pages/recommendations";
import SkillGapPage from "@/pages/skill-gap";
import CareerPathsPage from "@/pages/career-paths";
import AIAssistantPage from "@/pages/ai-assistant";
import FeedbackPage from "@/pages/feedback";
import PricingPage from "@/pages/pricing";
import AdminPage from "@/pages/admin";
import LoginPage from "@/pages/login";
import ResumeAnalyzerPage from "@/pages/resume-analyzer";
import NotFound from "@/pages/not-found";
import AIAssessmentsPage from "@/pages/ai-assessments";
import GithubGamificationPage from "@/pages/github-gamification";
import LeaderboardsPage from "@/pages/leaderboards";
import ResumeArchitectPage from "@/pages/resume-architect";
import CareerMultiplierPage from "@/pages/career-multiplier";
import GlobalHeatmapPage from "@/pages/global-heatmap";
import CodeArchitectPage from "@/pages/code-architect";
import PsychLabPage from "@/pages/psych-lab";
import NetworkEnginePage from "@/pages/network-engine";
import NegotiationSimPage from "@/pages/negotiation-sim";
import VisaIntelligencePage from "@/pages/visa-intelligence";
import SalaryBenchmarkerPage from "@/pages/salary-benchmarker";
import CompanyDeepDivePage from "@/pages/company-deep-dive";
import TechEvolutionPage from "@/pages/tech-evolution";
import ReferralsPage from "@/pages/referrals";
import OpenSourceHubPage from "@/pages/open-source";
import MentorshipPage from "@/pages/mentorship";
import EventsPage from "@/pages/events";
import LearningPathsPage from "@/pages/learning-paths";
import InterviewRoomPage from "@/pages/interview-room";
import TalentScoutPage from "@/pages/talent-scout";
import ProjectArchitectPage from "@/pages/project-architect";
import SkillGraphPage from "@/pages/skill-graph";
import MarketSentimentPage from "@/pages/market-sentiment";
import InterviewGhostPage from "@/pages/interview-ghost";
import PortfolioOptimizerPage from "@/pages/portfolio-optimizer";
import LegalAssistantPage from "@/pages/legal-assistant";
import DiversityInsightsPage from "@/pages/diversity-insights";
import BurnoutPredictorPage from "@/pages/burnout-predictor";
import AlumniHubPage from "@/pages/alumni-hub";
import { setBaseUrl } from "@workspace/api-client-react";
import { AuthProvider, useAuth } from "@/hooks/use-auth";

setBaseUrl("http://localhost:8080");

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});


function Router() {
  const { user, isLoading } = useAuth();
  const [location, setLocation] = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Define public routes
  const isPublicRoute = ["/", "/login", "/internships"].includes(location) || location.startsWith("/internships/");

  if (!user && !isPublicRoute) {
    setLocation("/login");
    return null;
  }

  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="*">
        <Layout>
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/dashboard" component={DashboardPage} />
            <Route path="/profile" component={ProfilePage} />
            <Route path="/internships" component={InternshipsPage} />
            <Route path="/internships/:id" component={InternshipDetailPage} />
            <Route path="/recommendations/:studentId" component={RecommendationsPage} />
            <Route path="/skill-gap/:studentId" component={SkillGapPage} />
            <Route path="/career-paths/:studentId" component={CareerPathsPage} />
            <Route path="/ai-assistant" component={AIAssistantPage} />
            <Route path="/feedback" component={FeedbackPage} />
            <Route path="/pricing" component={PricingPage} />
            <Route path="/admin" component={AdminPage} />
            <Route path="/resume-analyzer" component={ResumeAnalyzerPage} />
            <Route path="/ai-assessments" component={AIAssessmentsPage} />
            <Route path="/github-gamification" component={GithubGamificationPage} />
            <Route path="/leaderboards" component={LeaderboardsPage} />
            <Route path="/resume-architect" component={ResumeArchitectPage} />
            <Route path="/career-multiplier" component={CareerMultiplierPage} />
            <Route path="/global-heatmap" component={GlobalHeatmapPage} />
            <Route path="/code-architect" component={CodeArchitectPage} />
            <Route path="/psych-lab" component={PsychLabPage} />
            <Route path="/network-engine" component={NetworkEnginePage} />
            <Route path="/negotiation-sim" component={NegotiationSimPage} />
            <Route path="/visa-intelligence" component={VisaIntelligencePage} />
            <Route path="/salary-benchmarker" component={SalaryBenchmarkerPage} />
            <Route path="/company-deep-dive" component={CompanyDeepDivePage} />
            <Route path="/tech-evolution" component={TechEvolutionPage} />
            <Route path="/referrals" component={ReferralsPage} />
            <Route path="/open-source" component={OpenSourceHubPage} />
            <Route path="/mentorship" component={MentorshipPage} />
            <Route path="/events" component={EventsPage} />
            <Route path="/learning-paths" component={LearningPathsPage} />
            <Route path="/interview-room" component={InterviewRoomPage} />
            <Route path="/talent-scout" component={TalentScoutPage} />
            <Route path="/project-architect" component={ProjectArchitectPage} />
            <Route path="/skill-graph" component={SkillGraphPage} />
            <Route path="/market-sentiment" component={MarketSentimentPage} />
            <Route path="/interview-ghost" component={InterviewGhostPage} />
            <Route path="/portfolio-optimizer" component={PortfolioOptimizerPage} />
            <Route path="/legal-assistant" component={LegalAssistantPage} />
            <Route path="/diversity-insights" component={DiversityInsightsPage} />
            <Route path="/burnout-predictor" component={BurnoutPredictorPage} />
            <Route path="/alumni-hub" component={AlumniHubPage} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <AuthProvider>
              <Router />
            </AuthProvider>
          </WouterRouter>
          <Toaster richColors position="top-right" />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;

