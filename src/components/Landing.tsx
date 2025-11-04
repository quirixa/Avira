import { useState } from "react";
import { Play, Home, ShoppingCart, Server, Trophy, Users, Package, Map, Settings, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LandingProps {
  onPlayClick: () => void;
}

export const Landing = ({ onPlayClick }: LandingProps) => {
  const [selectedServer, setSelectedServer] = useState("NA East");

  const sidebarItems = [
    { icon: Home, label: "HUB" },
    { icon: ShoppingCart, label: "STORE" },
    { icon: Server, label: "SERVERS" },
    { icon: Trophy, label: "QUESTS" },
    { icon: Users, label: "FRIENDS" },
    { icon: Package, label: "INVENTORY" },
    { icon: Map, label: "MAP" },
  ];

  const regions = ["NA East", "NA West", "EU", "Asia", "South America"];

  return (
    <div className="w-full h-screen overflow-hidden gradient-bg relative">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold px-6">
          Login or Register
        </Button>
        
        <div className="flex gap-4">
          <Button variant="ghost" size="icon" className="text-foreground hover:bg-white/10">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
          </Button>
          <Button variant="ghost" size="icon" className="text-foreground hover:bg-white/10">
            <Download className="w-6 h-6" />
          </Button>
          <Button variant="ghost" size="icon" className="text-foreground hover:bg-white/10">
            <Settings className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Left Sidebar */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10">
        {sidebarItems.map((item, index) => (
          <Button
            key={index}
            variant="secondary"
            className="w-32 justify-start gap-3 bg-card/90 hover:bg-card border border-border shadow-lg"
          >
            <item.icon className="w-5 h-5" />
            <span className="font-bold text-sm">{item.label}</span>
          </Button>
        ))}
      </div>

      {/* Center Content */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
        <div className="relative">
          {/* Logo */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 text-center">
            <h1 className="text-7xl font-black text-foreground tracking-wider drop-shadow-2xl">
              AVIRA
            </h1>
            <p className="text-accent text-lg font-bold mt-2">Browser FPS Game</p>
          </div>
          
          {/* Character Preview */}
          <div className="w-96 h-96 bg-card/50 backdrop-blur-sm rounded-lg border-2 border-primary/30 shadow-2xl flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent"></div>
            <div className="w-32 h-32 bg-primary/80 rounded-lg shadow-xl animate-pulse"></div>
            <div className="absolute bottom-4 text-muted-foreground text-sm">Character Preview</div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Live Streams */}
      <div className="absolute right-4 top-24 w-64 bg-card/90 rounded-lg border border-border p-4 shadow-lg z-10">
        <h3 className="font-bold text-lg mb-3 text-accent">LIVE STREAMS</h3>
        <div className="space-y-2">
          <div className="bg-muted/50 rounded p-3 text-sm">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
              <span className="font-semibold">No streams live</span>
            </div>
            <p className="text-muted-foreground text-xs">Check back later!</p>
          </div>
        </div>
      </div>

      {/* Bottom Right Controls */}
      <div className="absolute bottom-8 right-8 flex flex-col gap-4 items-end z-10">
        {/* Region Selector */}
        <div className="bg-card/90 rounded-lg border border-border px-4 py-2 shadow-lg">
          <label className="text-xs text-muted-foreground block mb-1">REGION</label>
          <select 
            value={selectedServer}
            onChange={(e) => setSelectedServer(e.target.value)}
            className="bg-input text-foreground font-bold px-3 py-1 rounded border border-border cursor-pointer hover:border-primary transition-colors"
          >
            {regions.map((region) => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button 
            variant="secondary"
            className="font-bold px-6 py-6 text-base shadow-lg"
          >
            CREATE
          </Button>
          <Button 
            variant="secondary"
            className="font-bold px-6 py-6 text-base shadow-lg"
          >
            JOIN
          </Button>
        </div>

        {/* Play Button */}
        <Button 
          onClick={onPlayClick}
          className="bg-accent text-accent-foreground hover:bg-accent/90 font-black text-2xl px-16 py-8 rounded-lg shadow-2xl transform transition-all hover:scale-105 hover:shadow-accent/50"
        >
          <Play className="w-8 h-8 mr-2" />
          PLAY
        </Button>
      </div>
    </div>
  );
};
