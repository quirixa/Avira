import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { leaderboardData } from "@/data/leaderboardData";
import { Home, ShoppingBag, Server, Trophy, Users, Package, Map } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  { icon: Home, label: "HUB", path: "/HUB/leaderboard" },
  { icon: ShoppingBag, label: "STORE", path: "/store" },
  { icon: Server, label: "SERVERS", path: "/servers" },
  { icon: Trophy, label: "QUESTS", path: "/quests" },
  { icon: Users, label: "FRIENDS", path: "/friends" },
  { icon: Package, label: "INVENTORY", path: "/inventory" },
  { icon: Map, label: "MAP", path: "/map" },
];

const Leaderboard = () => {
  const navigate = useNavigate();
  const [region, setRegion] = useState("EU");
  const [timePeriod, setTimePeriod] = useState("daily");

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001a4d] via-[#002966] to-[#0047b3] text-foreground flex overflow-hidden">
      {/* Left Sidebar */}
      <aside className="hidden lg:flex flex-col w-20 bg-background/20 backdrop-blur-sm border-r border-primary/30 py-6">
        {sidebarItems.map((item, index) => (
          <button
            key={index}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center justify-center gap-2 py-6 px-4 text-foreground hover:bg-primary/20 hover:text-accent transition-all group border-l-4 border-transparent hover:border-accent"
          >
            <item.icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-wider">{item.label}</span>
          </button>
        ))}
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="flex flex-col lg:flex-row items-center justify-between mb-8 gap-4">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl md:text-6xl font-bold text-accent drop-shadow-[0_0_30px_rgba(255,215,0,0.5)] mb-2">
                AVIRA
              </h1>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Leaderboard
              </h2>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Time Period Toggle */}
              <div className="flex rounded-lg overflow-hidden border-2 border-primary/50 bg-background/50">
                {["daily", "weekly", "all-time"].map((period) => (
                  <button
                    key={period}
                    onClick={() => setTimePeriod(period)}
                    className={`px-6 py-2 font-bold uppercase text-sm transition-all ${
                      timePeriod === period
                        ? "bg-accent text-background shadow-[0_0_20px_rgba(255,215,0,0.3)]"
                        : "bg-transparent text-foreground hover:bg-primary/20"
                    }`}
                  >
                    {period === "all-time" ? "All Time" : period}
                  </button>
                ))}
              </div>

              {/* Region Selector */}
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger className="w-32 border-2 border-primary/50 bg-background/50 font-bold text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-2 border-primary">
                  <SelectItem value="EU" className="font-bold">🇪🇺 EU</SelectItem>
                  <SelectItem value="NA" className="font-bold">🇺🇸 NA</SelectItem>
                  <SelectItem value="AS" className="font-bold">🌏 AS</SelectItem>
                  <SelectItem value="SA" className="font-bold">🌎 SA</SelectItem>
                  <SelectItem value="OCE" className="font-bold">🌊 OCE</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="mb-8">
            <LeaderboardTable players={leaderboardData} />
          </div>

          {/* Mobile Sidebar */}
          <div className="lg:hidden grid grid-cols-4 gap-2 mt-8 border-t border-primary/30 pt-4">
            {sidebarItems.map((item, index) => (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center gap-1 py-3 px-2 rounded-lg text-foreground hover:bg-primary/20 hover:text-accent transition-all"
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs font-bold uppercase">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
