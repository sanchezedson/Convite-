/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, Sparkles, Volume2 } from "lucide-react";
import { CharacterMessage } from "../types";
import { carsAudio } from "../audio";

const CARS_CHARACTERS: CharacterMessage[] = [
  {
    id: "mcqueen",
    name: "Relâmpago McQueen",
    role: "O Campeão de Corrida",
    quote: "KACHOW! Isac, você já tem 2 anos!? Você é mais rápido que o vento! Estou aquecendo os motores para comemorar no Fogão Mineiro! Prepare-se para ver faíscas brilhando e muita alegria na pista!",
    carColor: "bg-cars-red text-white",
    accentColor: "border-cars-red text-cars-red",
    speed: "355 km/h",
  },
  {
    id: "mater",
    name: "Mate",
    role: "O Guinchador Camarada",
    quote: "Uhuuuu! Segura as pontas, Isac! 2 anos é uma marca digna do Grande Prêmio de Radiator Springs! Eu já estou lustrando meu para-choque! Vou com o guincho pronto pra te dar um abraço de pistão gigante!",
    carColor: "bg-amber-800 text-amber-50",
    accentColor: "border-amber-800 text-amber-800",
    speed: "120 km/h",
  },
  {
    id: "sally",
    name: "Sally",
    role: "A Advogada Charmosa",
    quote: "Parabéns, Isac! Que jornada fantástica você tem pela frente! Radiator Springs envia todo o carinho do mundo para o seu aniversário. Mal posso esperar para ver você se divertindo com sua família em Campinas!",
    carColor: "bg-cars-blue text-white",
    accentColor: "border-cars-blue text-cars-blue",
    speed: "250 km/h",
  },
  {
    id: "doc",
    name: "Doc Hudson",
    role: "O Juiz da Pista",
    quote: "Aprenda bem as curvas da pista, garoto Isac. Dois anos de idade é o momento de acelerar com sabedoria e dar muitas risadas. Você tem a alma de um verdadeiro campeão. Parabéns, Isac! Nos vemos na largada.",
    carColor: "bg-slate-800 text-white",
    accentColor: "border-slate-800 text-slate-800",
    speed: "280 km/h",
  },
];

export default function CharacterGreetings() {
  const [activeId, setActiveId] = useState<string>("mcqueen");

  const activeChar = CARS_CHARACTERS.find((c) => c.id === activeId) || CARS_CHARACTERS[0];

  const handleCharacterClick = (id: string) => {
    setActiveId(id);
    if (id === "mcqueen") {
      carsAudio.playEngineRev();
    } else if (id === "mater") {
      carsAudio.playHonk();
    } else {
      carsAudio.playStarterBeep(true);
    }
  };

  return (
    <div id="character-greetings" className="bg-white rounded-2xl shadow-xl border-4 border-cars-yellow p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-cars-yellow opacity-10 rounded-full blur-2xl"></div>
      
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="font-display text-xl tracking-wider text-stone-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cars-yellow fill-cars-yellow animate-spin" />
            CONVITE DOS CAMPEÕES!
          </h3>
          <p className="text-xs text-stone-500 font-semibold font-mono uppercase">AS MENSAGENS ESPECIAIS PARA O ISAC</p>
        </div>
      </div>

      {/* Grid of buttons to change character */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {CARS_CHARACTERS.map((char) => {
          const isActive = char.id === activeId;
          return (
            <button
              key={char.id}
              onClick={() => handleCharacterClick(char.id)}
              className={`cursor-pointer group flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                isActive
                  ? `${char.id === "mcqueen" ? "border-cars-red bg-red-50 text-cars-red" : ""} ${
                      char.id === "mater" ? "border-amber-800 bg-amber-50 text-amber-900" : ""
                    } ${char.id === "sally" ? "border-cars-blue bg-blue-50 text-cars-blue" : ""} ${
                      char.id === "doc" ? "border-slate-800 bg-slate-50 text-slate-800" : ""
                    } scale-105 shadow-md`
                  : "border-stone-200 hover:border-stone-400 bg-stone-50 text-stone-600"
              }`}
            >
              {/* Cute thematic placeholder car icon representing character colors */}
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-1.5 font-bold text-sm ${
                  isActive ? char.carColor : "bg-stone-300 text-stone-700"
                } group-hover:scale-110 transition-transform`}
              >
                🚗
              </div>
              <span className="text-xs font-display tracking-wide">{char.name}</span>
              <span className="text-[10px] font-mono text-stone-400 mt-0.5">{char.role}</span>
            </button>
          );
        })}
      </div>

      {/* Active character bubble */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeId}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.18 }}
          className={`border-2 rounded-2xl p-5 relative ${activeChar.accentColor} bg-stone-50`}
        >
          {/* Audio trigger banner inside message box */}
          <div className="absolute top-3 right-3">
            <button
              onClick={() => handleCharacterClick(activeChar.id)}
              className="cursor-pointer bg-white border border-stone-200 rounded-full p-2 text-stone-500 hover:text-cars-red hover:border-cars-red transition-all shadow-sm flex items-center justify-center hover:scale-115"
              title="Ouvir som do veículo!"
            >
              <Volume2 className="w-4 h-4 animate-bounce" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-4">
            <div>
              <span className="font-display text-lg tracking-wider block text-stone-900 uppercase">
                {activeChar.name}
              </span>
              <span className="text-[11px] font-mono tracking-wider text-mango bg-stone-200/60 px-2 py-0.5 rounded font-extrabold">
                {activeChar.role}
              </span>
            </div>
            
            <div className="sm:ml-auto flex items-center gap-1.5 text-stone-500 font-mono text-[10px] font-black italic bg-stone-100 rounded px-2 py-1">
              <span>PRODUÇÃO DE VELOCIDADE MÁXIMA:</span>
              <span className="text-stone-900">{activeChar.speed}</span>
            </div>
          </div>

          {/* Speech Bubble Arrow */}
          <div className="absolute left-6 -top-3 w-4 h-3 bg-stone-50 border-t-2 border-l-2 rotate-45 border-inherit"></div>

          <div className="flex gap-3">
            <div className="text-3xl select-none text-stone-300">
              <MessageSquare className="w-6 h-6 fill-stone-100 text-stone-400 shrink-0 mt-1" />
            </div>
            <p className="text-stone-800 text-sm leading-relaxed italic pr-4">
              "{activeChar.quote}"
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-4 text-center">
        <p className="text-[10px] text-stone-400 font-mono">DICA: CLIQUE NOS PERSONAGENS ACIMA PARA ATIVAR O SOM DOS MOTORES DE CORRIDA!</p>
      </div>
    </div>
  );
}
