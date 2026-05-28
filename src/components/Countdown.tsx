/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Flag, Play, RefreshCw } from "lucide-react";
import { carsAudio } from "../audio";

export default function Countdown() {
  const targetDate = new Date("2026-08-01T16:00:00").getTime();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false,
  });

  // Racing lights simulation state
  const [lightsActive, setLightsActive] = useState(false);
  const [lightLevel, setLightLevel] = useState(0); // 0 to 4 (1, 2, 3 red, 4 green)
  const [lightsMessage, setLightsMessage] = useState("DESAFIO DAS PISTAS: ACELERE!");

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds, isOver: false });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  // Race start lights sequence simulation
  const startRaceLights = () => {
    if (lightsActive) return;
    setLightsActive(true);
    setLightLevel(0);
    setLightsMessage("PILOTOS, PREPARAR...");
    
    // Light 1 (Red)
    setTimeout(() => {
      setLightLevel(1);
      carsAudio.playStarterBeep(false);
    }, 1000);

    // Light 2 (Red)
    setTimeout(() => {
      setLightLevel(2);
      carsAudio.playStarterBeep(false);
    }, 2000);

    // Light 3 (Red)
    setTimeout(() => {
      setLightLevel(3);
      carsAudio.playStarterBeep(false);
    }, 3000);

    // Light 4 (Green) - GO!
    setTimeout(() => {
      setLightLevel(4);
      carsAudio.playStarterBeep(true);
      carsAudio.playEngineRev();
      setLightsMessage("GO! ACELERA, ISAC! 🏁");
    }, 4000);

    // Settle / Reset
    setTimeout(() => {
      setLightsActive(false);
      setLightLevel(0);
      setLightsMessage("DESAFIO DAS PISTAS: ACELERE!");
    }, 7000);
  };

  const timeBlocks = [
    { label: "DIAS", val: timeLeft.days, color: "text-cars-red" },
    { label: "HORAS", val: timeLeft.hours, color: "text-cars-yellow" },
    { label: "MINUTOS", val: timeLeft.minutes, color: "text-cars-blue" },
    { label: "SEGUNDOS", val: timeLeft.seconds, color: "text-amber-500" },
  ];

  return (
    <div id="countdown-dashboard" className="bg-cars-dark text-white p-6 rounded-2xl border-4 border-cars-red shadow-xl relative overflow-hidden">
      {/* Background neon style light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-cars-red blur-md opacity-70"></div>
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h3 className="font-display text-xl tracking-wide flex items-center gap-2 text-cars-yellow">
            <Flag className="w-5 h-5 animate-pulse text-cars-yellow" />
            CRONÔMETRO DA CORRIDA
          </h3>
          <p className="text-xs text-stone-400 font-medium">CONTAGEM REGRESSIVA PARA O GRANDE PRÊMIO</p>
        </div>
        
        {/* Playful Interactive starter lights widget */}
        <div className="flex items-center gap-3 bg-stone-900 border border-stone-800 px-4 py-2 rounded-xl">
          <div className="flex gap-1.5 bg-stone-950 p-1.5 rounded-lg">
            {[1, 2, 3].map((num) => (
              <div 
                key={num} 
                className={`w-3 h-3 rounded-full border border-black transition-all duration-200 ${
                  lightLevel >= num ? "bg-red-500 shadow-[0_0_8px_#ef4444]" : "bg-red-950"
                }`}
              />
            ))}
            <div 
              className={`w-3 h-3 rounded-full border border-black transition-all duration-200 ${
                lightLevel === 4 ? "bg-green-500 shadow-[0_0_8px_#22c55e]" : "bg-green-950"
              }`}
            />
          </div>
          
          <button
            onClick={startRaceLights}
            disabled={lightsActive}
            className={`cursor-pointer px-3 py-1 text-xs font-mono rounded font-extrabold flex items-center gap-1.5 transition-all text-black uppercase ${
              lightsActive 
                ? "bg-stone-800 text-stone-500 cursor-not-allowed" 
                : "bg-cars-yellow hover:bg-yellow-400 hover:scale-105 active:scale-95"
            }`}
          >
            {lightsActive ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3 fill-black" />}
            {lightsActive ? "Correndo" : "Vruum!"}
          </button>
        </div>
      </div>

      {lightsActive && (
        <motion.div 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center font-mono text-xs font-bold py-1 mb-4 rounded bg-stone-900 border border-stone-800 text-cars-yellow tracking-widest uppercase"
        >
          {lightsMessage}
        </motion.div>
      )}

      {/* Grid of counters */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        {timeBlocks.map((block, idx) => (
          <div key={idx} className="bg-stone-950 border border-stone-800 rounded-xl p-3 text-center relative flex flex-col justify-between">
            <div className="absolute top-1 left-2 text-[8px] font-mono font-bold text-stone-500 tracking-wider">
              LAP {idx + 1}
            </div>
            
            <div className="my-2">
              <span className={`font-mono text-3xl sm:text-4xl font-extrabold italic tracking-tight tracking-tighter ${block.color}`}>
                {block.val.toString().padStart(2, "0")}
              </span>
            </div>
            
            <div className="text-[10px] sm:text-xs font-bold text-stone-400 border-t border-stone-900 pt-1">
              {block.label}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between text-[11px] font-mono text-stone-400 bg-stone-900/50 p-2.5 rounded-lg border border-stone-800/80">
        <span>CATEGORIA: INFANTIL 2 ANOS</span>
        <span>STATUS: PISTA PREPARADA</span>
      </div>
    </div>
  );
}
