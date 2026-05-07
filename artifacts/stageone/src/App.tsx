import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Studio from "@/pages/Studio";
import Pricing from "@/pages/Pricing";
import Showcase from "@/pages/Showcase";
import Onboarding from "@/pages/Onboarding";
import { useAuth, useArtist } from "@/hooks/useAuth";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

function ProtectedRoute({
  component: Component,
  requireOnboarding = true,
}: {
  component: React.ComponentType;
  requireOnboarding?: boolean;
}) {
  const [, navigate] = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { hasOnboarded, isLoading: artistLoading } = useArtist();

  useEffect(() => {
    if (authLoading || artistLoading) return;
    if (!isAuthenticated) {
      window.location.href = "/api/login";
      return;
    }
    if (requireOnboarding && !hasOnboarded) {
      navigate("/onboarding");
    }
  }, [authLoading, artistLoading, isAuthenticated, hasOnboarded, requireOnboarding, navigate]);

  if (authLoading || artistLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;
  if (requireOnboarding && !hasOnboarded) return null;

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/dashboard">
        {() => <ProtectedRoute component={Dashboard} />}
      </Route>
      <Route path="/studio">
        {() => <ProtectedRoute component={Studio} />}
      </Route>
      <Route path="/pricing" component={Pricing} />
      <Route path="/showcase" component={Showcase} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
