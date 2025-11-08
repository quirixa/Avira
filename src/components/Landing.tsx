import React, { Suspense, useState } from "react";
import { Link } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Html } from "@react-three/drei";
import {
  Play,
  Home,
  ShoppingCart,
  Server,
  Trophy,
  Users,
  Package,
  Map,
  Settings,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button"; // adjust if your Button lives elsewhere

interface LandingProps {
  onPlayClick: () => void;
}

/**
 * ModelLoader: loads the .glb (static - no auto-rotation)
 * Expects the model to be available at /player-model.glb (place it in public/)
 */
function ModelLoader({ url = "/player-model.glb" }: { url?: string }) {
  const { scene } = useGLTF(url, true) as any;
  // Optionally adjust scene scale/rotation/position here.
  return <primitive object={scene} scale={[1.1, 1.1, 1.1]} position={[0, -1.2, 0]} />;
}

/**
 * Simple fallback while the model loads
 */
function CanvasFallback() {
  return (
    <Html center>
      <div className="px-4 py-2 rounded-md bg-white/5 border border-white/10 text-sm font-medium">
        Loading model...
      </div>
    </Html>
  );
}

export const LandingDark = ({ onPlayClick }: LandingProps) => {
  const [selectedServer, setSelectedServer] = useState("EU");

  const sidebarItems = [
    { icon: Home, label: "HUB", path: "/" },
    { icon: ShoppingCart, label: "STORE", path: "/" },
    { icon: Server, label: "SERVERS", path: "/" },
    { icon: Trophy, label: "LEADERBOARD", path: "/leaderboard" },
    { icon: Users, label: "FRIENDS", path: "/" },
    { icon: Package, label: "INVENTORY", path: "/" },
    { icon: Map, label: "MAP", path: "/" },
  ];

  const regions = ["NA East", "NA West", "EU", "Asia", "South America"];

  return (
    <div className="w-full h-screen overflow-hidden relative bg-gradient-to-b from-[#071026] to-[#0b2a42]">
      {/* Top Bar */}
      <div className="absolute top-4 left-6 right-6 z-20 flex items-center justify-between">
        <Button className="bg-yellow-400 text-black font-bold px-5 py-2 shadow-lg">
          LOGIN OR REGISTER
        </Button>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="hover:bg-white/5">
            {/* Discord-like SVG */}
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
          </Button>

          <Button variant="ghost" size="icon" className="hover:bg-white/5">
            <Download className="w-6 h-6" />
          </Button>

          <Button variant="ghost" size="icon" className="hover:bg-white/5">
            <Settings className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Left Sidebar */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3">
        {sidebarItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Link key={idx} to={item.path}>
              <div className="flex items-center gap-3 w-40 px-3 py-2 rounded-xl bg-white/3 border border-white/6 backdrop-blur-sm hover:scale-105 transition-transform shadow-sm">
                <Icon className="w-5 h-5 text-white/90" />
                <span className="text-sm font-bold tracking-wider text-white/90">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Center: Logo + Model + Party Slots */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <div className="w-[980px] max-w-[95%] relative pointer-events-auto">
          {/* Top Logo centered above model */}
          <div className="absolute -top-28 left-1/2 -translate-x-1/2 text-center z-30">
            <h1 className="text-6xl font-extrabold text-white tracking-wide drop-shadow-lg">AVIRA</h1>
            <p className="text-sm text-cyan-300 font-semibold mt-1">Next-Gen Browser FPS</p>
          </div>

          {/* Party slots */}
          <div className="absolute -left-12 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-20">
            {/* Left three small add-party cards (stylized) */}
            {[0,1,2].map(i => (
              <div key={i} className="w-44 h-28 rounded-lg border border-white/8 bg-white/2 flex items-center justify-center">
                <div className="flex flex-col items-center text-white/70">
                  <div className="text-2xl font-bold">+</div>
                  <div className="text-xs font-semibold mt-1">ADD PARTY</div>
                </div>
              </div>
            ))}
          </div>

          <div className="absolute -right-12 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-20">
            {/* Right add party */}
            <div className="w-44 h-28 rounded-lg border border-white/8 bg-white/2 flex items-center justify-center">
              <div className="flex flex-col items-center text-white/70">
                <div className="text-2xl font-bold">+</div>
                <div className="text-xs font-semibold mt-1">ADD PARTY</div>
              </div>
            </div>
          </div>

          {/* Player model canvas + pedestal card */}
          <div className="mx-auto w-[520px] h-[420px] rounded-2xl border border-white/8 bg-gradient-to-b from-white/2 to-transparent shadow-2xl relative overflow-hidden">
            {/* subtle ring/pedestal */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-56 h-6 rounded-full bg-gradient-to-r from-cyan-400/40 via-purple-400/30 to-yellow-400/20 blur-sm opacity-60" />

            <Canvas camera={{ position: [0, 0, 5], fov: 35 }}>
              <ambientLight intensity={0.9} />
              <directionalLight position={[5, 5, 5]} intensity={1.2} />
              <Suspense fallback={<CanvasFallback />}>
                <ModelLoader url="/player-model.glb" />
                <Environment preset="studio" />
              </Suspense>

              {/* Orbit controls but no rotation, allow zoom & pan a bit */}
              <OrbitControls
                enableRotate={false}
                enablePan={false}
                enableZoom={true}
                minDistance={3}
                maxDistance={10}
              />
            </Canvas>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-white/70">Character Preview</div>
          </div>
        </div>
      </div>

      {/* Bottom-right controls */}
      <div className="absolute bottom-8 right-8 z-30 flex flex-col items-end gap-4">
        <div className="bg-white/3 border border-white/8 rounded-xl px-4 py-3 w-60 backdrop-blur-sm">
          <label className="block text-xs text-white/80 font-semibold mb-2">REGION</label>
          <select
            value={selectedServer}
            onChange={(e) => setSelectedServer(e.target.value)}
            className="w-full bg-transparent text-white/90 font-bold px-3 py-2 rounded border border-white/6 outline-none"
          >
            {regions.map((r) => (
              <option key={r} value={r} className="bg-[#071026] text-white">{r}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" className="font-bold px-6 py-3 rounded-lg bg-white/5 border border-white/8">
            CREATE
          </Button>
          <Button variant="secondary" className="font-bold px-6 py-3 rounded-lg bg-white/5 border border-white/8">
            JOIN
          </Button>
        </div>

        <Button
          onClick={onPlayClick}
          className="mt-2 bg-cyan-400 text-black font-extrabold text-xl px-12 py-4 rounded-2xl shadow-2xl transform hover:scale-105 transition"
        >
          <div className="flex items-center gap-3">
            <Play className="w-6 h-6" />
            PLAY
          </div>
        </Button>
      </div>
    </div>
  );
};
