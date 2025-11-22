import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// 🧩 HUB pages
import HubLayout from "./pages/HUB/Leaderboard"; // This is your main HUB layout (index.tsx)
import Leaderboard from "./pages/HUB/Leaderboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Landing */}
          <Route path="/" element={<Index />} />

          {/* HUB + nested routes */}
          <Route path="/HUB" element={<HubLayout />}>
            {/* Default page when visiting /HUB, directly render Leaderboard */}
            <Route index element={<Leaderboard />} />
            {/* /HUB/leaderboard */}
            <Route path="leaderboard" element={<Leaderboard />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
