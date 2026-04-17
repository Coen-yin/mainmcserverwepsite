import { useEffect, useRef } from "react";
import { ClerkProvider, SignIn, SignUp, Show, useClerk } from '@clerk/react';
import { Switch, Route, useLocation, Router as WouterRouter, Redirect } from 'wouter';
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout";

// Pages
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import Profile from "@/pages/profile";
import ForumsIndex from "@/pages/forums/index";
import ForumsCategory from "@/pages/forums/category";
import ForumsThread from "@/pages/forums/thread";
import ForumsNewThread from "@/pages/forums/new-thread";
import Announcements from "@/pages/announcements";
import Rules from "@/pages/rules";
import Bans from "@/pages/bans";
import Appeals from "@/pages/appeals";
import Apply from "@/pages/apply";
import Vote from "@/pages/vote";
import Leaderboard from "@/pages/leaderboard";
import Gallery from "@/pages/gallery";
import Store from "@/pages/store";
import Changelog from "@/pages/changelog";
import Support from "@/pages/support";
import Admin from "@/pages/admin";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

if (!clerkPubKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY in .env file');
}

const clerkAppearance = {
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: "hsl(142, 71%, 45%)", // emerald green
    colorBackground: "hsl(240, 10%, 6%)",
    colorInputBackground: "hsl(240, 10%, 12%)",
    colorText: "hsl(0, 0%, 98%)",
    colorTextSecondary: "hsl(240, 5%, 65%)",
    colorInputText: "hsl(0, 0%, 98%)",
    colorNeutral: "hsl(240, 10%, 12%)",
    borderRadius: "0.25rem",
    fontFamily: "'Inter', sans-serif",
    fontFamilyButtons: "'Inter', sans-serif",
  },
  elements: {
    rootBox: "w-full",
    cardBox: "shadow-[0_0_15px_rgba(34,197,94,0.15)] border border-green-500/30 rounded-lg w-full overflow-hidden",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none border-t border-green-500/20",
    headerTitle: { color: "hsl(0, 0%, 98%)", fontFamily: "'Silkscreen', cursive" },
    headerSubtitle: { color: "hsl(240, 5%, 65%)" },
    socialButtonsBlockButtonText: { color: "hsl(0, 0%, 98%)" },
    formFieldLabel: { color: "hsl(0, 0%, 98%)" },
    footerActionLink: { color: "hsl(142, 71%, 45%)" },
    footerActionText: { color: "hsl(240, 5%, 65%)" },
    dividerText: { color: "hsl(240, 5%, 65%)" },
    identityPreviewEditButton: { color: "hsl(142, 71%, 45%)" },
    formFieldSuccessText: { color: "hsl(142, 71%, 45%)" },
    alertText: { color: "hsl(0, 84%, 60%)" },
  },
};

function SignInPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 bg-[url('https://images.unsplash.com/photo-1607513746994-51f730a44832?q=80&w=2000')] bg-cover bg-center">
      <div className="absolute inset-0 bg-background/90 backdrop-blur-sm z-0"></div>
      <div className="z-10 w-full max-w-md">
        <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
      </div>
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 bg-[url('https://images.unsplash.com/photo-1607513746994-51f730a44832?q=80&w=2000')] bg-cover bg-center">
      <div className="absolute inset-0 bg-background/90 backdrop-blur-sm z-0"></div>
      <div className="z-10 w-full max-w-md">
        <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
      </div>
    </div>
  );
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const queryClient = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (
        prevUserIdRef.current !== undefined &&
        prevUserIdRef.current !== userId
      ) {
        queryClient.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, queryClient]);

  return null;
}

function HomeRedirect() {
  return (
    <>
      <Show when="signed-in">
        <Redirect to="/dashboard" />
      </Show>
      <Show when="signed-out">
        <Home />
      </Show>
    </>
  );
}

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  return (
    <>
      <Show when="signed-in">
        <Component />
      </Show>
      <Show when="signed-out">
        <Redirect to="/sign-in" />
      </Show>
    </>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      localization={{
        signIn: {
          start: {
            title: "Access Headquarters",
            subtitle: "Sign in to techy Network",
          },
        },
        signUp: {
          start: {
            title: "Join techy Network",
            subtitle: "Create your player profile",
          },
        },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <TooltipProvider>
          <Switch>
            <Route path="/sign-in/*?" component={SignInPage} />
            <Route path="/sign-up/*?" component={SignUpPage} />
            
            <Route>
              <Layout>
                <Switch>
                  <Route path="/" component={HomeRedirect} />
                  <Route path="/dashboard"><ProtectedRoute component={Dashboard} /></Route>
                  <Route path="/profile"><ProtectedRoute component={Profile} /></Route>
                  
                  {/* Forums Routing */}
                  <Route path="/forums" component={ForumsIndex} />
                  <Route path="/forums/category/:categoryId" component={ForumsCategory} />
                  <Route path="/forums/thread/:threadId" component={ForumsThread} />
                  <Route path="/forums/new" component={ForumsNewThread} />
                  
                  <Route path="/announcements" component={Announcements} />
                  <Route path="/rules" component={Rules} />
                  <Route path="/bans" component={Bans} />
                  <Route path="/appeals" component={Appeals} />
                  <Route path="/apply" component={Apply} />
                  <Route path="/vote" component={Vote} />
                  <Route path="/leaderboard" component={Leaderboard} />
                  <Route path="/gallery" component={Gallery} />
                  <Route path="/store" component={Store} />
                  <Route path="/changelog" component={Changelog} />
                  <Route path="/support" component={Support} />
                  <Route path="/admin" component={Admin} />
                  <Route component={NotFound} />
                </Switch>
              </Layout>
            </Route>
          </Switch>
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
      <Toaster />
    </WouterRouter>
  );
}

export default App;
