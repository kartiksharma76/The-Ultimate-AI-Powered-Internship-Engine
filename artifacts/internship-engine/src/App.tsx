import { Switch, Route, useLocation, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
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
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
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
  );
}

export default App;
