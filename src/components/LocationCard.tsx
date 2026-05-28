/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { MapPin, Calendar, Clock, Navigation, ExternalLink, Compass } from "lucide-react";
import { carsAudio } from "../audio";

export default function LocationCard() {
  const address = "Fogão Mineiro - Rod. Dr. Toledos de O de Camargo, Km 0 - Sousas, Campinas - SP, 13106-032";
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=Fogao+Mineiro+Sousas+Campinas`;

  const timelineEvents = [
    { time: "16:00", title: "ALINHAMENTO NO GRID", desc: "Chegada dos pilotos & check-in nos boxes." },
    { time: "17:00", title: "BANDEIRA VERDE", desc: "Voltas rápidas pioneiras e muita diversão na pista!" },
    { time: "18:30", title: "PARADA NOS BOXES", desc: "Reabastecimento oficial com o delicioso buffet mineiro!" },
    { time: "19:30", title: "PÓDIO DO CAMPEÃO", desc: "Hora de cantar o parabéns oficial para o nosso campeão de 2 anos, Isac!" },
  ];

  return (
    <div id="location-card" className="bg-white rounded-2xl shadow-xl border-4 border-cars-blue overflow-hidden relative">
      {/* Decorative top header styled like blue spoiler */}
      <div className="bg-gradient-to-r from-cars-blue to-[#0A5FA0] text-white px-6 py-4 flex justify-between items-center relative">
        <div>
          <h3 className="font-display text-xl tracking-wider uppercase text-cars-yellow flex items-center gap-1.5">
            <Compass className="w-5 h-5" />
            PISTA DE CORRIDA & BOXES
          </h3>
          <p className="text-xs text-white/90 font-medium">SAIBA A HORA E O LOCAL DA LARGADA</p>
        </div>
        <div className="hidden sm:block font-mono text-xs font-bold bg-white/20 px-3 py-1.5 rounded border border-white/30">
          GP ISAC #02
        </div>
      </div>

      {/* Main Info Columns */}
      <div className="p-6">
        <div className="grid md:grid-cols-12 gap-6 pb-6 border-b border-stone-200">
          {/* Calendar Box */}
          <div className="md:col-span-4 bg-stone-50 rounded-xl p-4 border border-stone-200 text-center flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-cars-red"></div>
            <Calendar className="w-10 h-10 text-cars-red mb-2" />
            <span className="font-mono text-xs font-extrabold text-stone-500 uppercase">DATA DA ETAPA</span>
            <span className="font-display text-2xl text-stone-900 mt-1">01 / AGOST / 26</span>
            <span className="text-xs font-bold text-cars-red bg-red-50 px-2.5 py-0.5 rounded-full mt-2">SÁBADO</span>
          </div>

          {/* Time Box */}
          <div className="md:col-span-4 bg-stone-50 rounded-xl p-4 border border-stone-200 text-center flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-cars-yellow"></div>
            <Clock className="w-10 h-10 text-amber-500 mb-2" />
            <span className="font-mono text-xs font-extrabold text-stone-500 uppercase">CRONOGRAMA (BOXES)</span>
            <span className="font-display text-2xl text-stone-900 mt-1">16:00 HRS</span>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full mt-2">SINAL VERDE</span>
          </div>

          {/* Location Box */}
          <div className="md:col-span-4 bg-stone-50 rounded-xl p-4 border border-stone-200 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-cars-blue"></div>
            <MapPin className="w-10 h-10 text-cars-blue mb-2 animate-bounce" />
            <span className="font-mono text-xs font-extrabold text-stone-500 uppercase">LOCAL DO CIRCUITO</span>
            <span className="font-display text-xl text-stone-900 mt-1">FOGÃO MINEIRO</span>
            <span className="text-xs font-medium text-stone-600 mt-1">Campinas (Sousas) - SP</span>
          </div>
        </div>

        {/* Detailed Address Detail Block */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-stone-50 p-4 rounded-xl border border-stone-200 gap-4">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-cars-blue/10 flex items-center justify-center shrink-0 self-start sm:self-center">
              <MapPin className="w-5 h-5 text-cars-blue" />
            </div>
            <div>
              <h4 className="font-bold text-stone-900 text-sm">Circuito Fogão Mineiro</h4>
              <p className="text-xs text-stone-600 mt-0.5 line-clamp-2 md:line-clamp-none">{address}</p>
            </div>
          </div>
          
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              carsAudio.playHonk();
            }}
            className="cursor-pointer font-bold text-xs bg-cars-blue hover:bg-cars-blue/95 hover:scale-105 active:scale-95 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-md transition-all self-stretch sm:self-auto text-center justify-center"
          >
            <Navigation className="w-4 h-4 fill-white" />
            ABRIR GOOGLE MAPS
            <ExternalLink className="w-3" />
          </a>
        </div>

        {/* Detailed Chronogram Schedule Section */}
        <div className="mt-8">
          <h4 className="font-mono text-xs font-extrabold text-stone-400 tracking-wider mb-4 uppercase">
            PROGRAMAÇÃO DO GRANDE PRÊMIO
          </h4>
          <div className="space-y-4 relative before:absolute before:inset-y-1 before:left-3.5 before:w-1 before:bg-stone-200">
            {timelineEvents.map((evt, idx) => (
              <motion.div 
                whileHover={{ x: 3 }}
                key={idx} 
                className="flex gap-4 relative"
              >
                {/* Bullet circle */}
                <div className="w-8 h-8 rounded-full bg-white border-2 border-cars-red flex items-center justify-center font-mono text-[10px] font-bold text-cars-red z-10 shrink-0 shadow-sm">
                  {idx + 1}
                </div>
                
                {/* Event text */}
                <div className="bg-stone-50 p-3 rounded-lg border border-stone-200/60 grow">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-display text-sm text-stone-900 tracking-wider">{evt.title}</span>
                    <span className="font-mono text-xs font-black text-cars-red italic bg-red-50 px-2 rounded">
                      {evt.time}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 font-medium leading-relaxed">{evt.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="bg-checkered-light h-6 rounded-lg mt-8 opacity-40"></div>
      </div>
    </div>
  );
}
