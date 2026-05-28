/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Coffee, Gift, HelpCircle, CheckCircle, Flame, Sparkles } from "lucide-react";
import { GiftItem } from "../types";
import { carsAudio } from "../audio";

export default function GiftList() {
  const [gifts, setGifts] = useState<GiftItem[]>([
    { id: "1", category: "Roupas e Moda", suggestion: "Roupas tamanho 2 ou 3 (Ele adora camisas de corrida!)", reserved: false },
    { id: "2", category: "Calçados", suggestion: "Tênis ou Sandálias tamanho 22 (Para correr nas pistas)", reserved: false },
    { id: "3", category: "Brinquedos Temáticos", suggestion: "Carrinhos da coleção Carros Disney (McQueen, Mate etc.)", reserved: false },
    { id: "4", category: "Raciocínio & Blocos", suggestion: "Lego Duplo ou Blocos de montar grandes", reserved: false },
    { id: "5", category: "Livros & Criatividade", suggestion: "Livros infantis com som, texturas ou de colorir", reserved: false },
    { id: "6", category: "Higiene", suggestion: "Fraldas descartáveis tamanho GG ou Toalhinhas umedecidas", reserved: false },
  ]);

  const [reserveName, setReserveName] = useState("");
  const [activeItem, setActiveItem] = useState<GiftItem | null>(null);

  const toggleReservation = (id: string) => {
    const item = gifts.find((g) => g.id === id);
    if (!item) return;

    if (item.reserved) {
      // Free the item
      setGifts(
        gifts.map((g) =>
          g.id === id ? { ...g, reserved: false, reservedBy: undefined } : g
        )
      );
      carsAudio.playHonk();
    } else {
      // Set to prompt reservation name
      setActiveItem(item);
    }
  };

  const handleConfirmReservation = (e: FormEvent) => {
    e.preventDefault();
    if (!activeItem || !reserveName.trim()) return;

    setGifts(
      gifts.map((g) =>
        g.id === activeItem.id
          ? { ...g, reserved: true, reservedBy: reserveName.trim() }
          : g
      )
    );
    
    setReserveName("");
    setActiveItem(null);
    carsAudio.playSuccessFanfare();
  };

  return (
    <div id="gift-list-section" className="bg-white rounded-2xl shadow-xl border-4 border-cars-blue overflow-hidden relative">
      <div className="bg-gradient-to-r from-cars-blue to-cyan-700 text-white px-6 py-4 flex items-center justify-between">
        <div>
          <h3 className="font-display text-xl tracking-wider text-cars-yellow flex items-center gap-1.5 uppercase">
            <Gift className="w-5 h-5" />
            SUGESTÕES DE PRESENTES
          </h3>
          <p className="text-xs text-white/90 font-medium">IDEIAS COM CARINHO PARA QUEM QUISER PRESENTEAR O ISAC</p>
        </div>
        <Sparkles className="w-7 h-7 text-white/30 animate-pulse" />
      </div>

      <div className="p-6">
        <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 mb-6 text-stone-700 space-y-2">
          <p className="text-xs font-semibold flex items-center gap-1.5 text-cars-blue">
            <Flame className="w-4 h-4 fill-cars-blue" />
            INFORMAÇÕES DE TAMANHO ÚTEIS:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
            <div className="bg-white p-2.5 rounded border border-blue-100 text-center shadow-xs">
              <span className="block text-[10px] font-mono text-stone-400 font-bold uppercase">ROUPINHAS</span>
              <span className="text-sm font-display text-cars-blue tracking-wide">TAMANHO 2 OU 3</span>
            </div>
            <div className="bg-white p-2.5 rounded border border-blue-100 text-center shadow-xs">
              <span className="block text-[10px] font-mono text-stone-400 font-bold uppercase">CALÇADOS</span>
              <span className="text-sm font-display text-cars-blue tracking-wide">TAMANHO 22</span>
            </div>
            <div className="bg-white p-2.5 rounded border border-blue-100 text-center shadow-xs col-span-2 md:col-span-1">
              <span className="block text-[10px] font-mono text-stone-400 font-bold uppercase">PREFERÊNCIA</span>
              <span className="text-sm font-display text-cars-blue tracking-wide">RODA LIVRE!</span>
            </div>
          </div>
        </div>

        {/* Gift Grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          {gifts.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border-2 transition-all flex flex-col justify-between ${
                item.reserved
                  ? "border-green-300 bg-green-50/40 opacity-90"
                  : "border-stone-200 hover:border-cars-blue bg-stone-50"
              }`}
            >
              <div>
                <div className="flex justify-between items-start gap-1 pb-1">
                  <span className={`text-[10px] font-mono font-black uppercase tracking-wider ${
                    item.reserved ? "text-green-600" : "text-cars-blue"
                  }`}>
                    {item.category}
                  </span>
                  
                  {item.reserved && (
                    <span className="text-[10px] font-bold text-green-600 bg-white border border-green-200 px-2 rounded-full flex items-center gap-0.5">
                      <CheckCircle className="w-3 h-3 fill-green-600 text-white" />
                      RESERVADO
                    </span>
                  )}
                </div>

                <p className="text-sm font-semibold text-stone-900 mt-1 line-clamp-2">
                  {item.suggestion}
                </p>

                {item.reserved && (
                  <p className="text-xs text-green-700 italic mt-2 bg-green-50 p-1 rounded">
                    Reservado por: {item.reservedBy}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-stone-200/80 flex items-center">
                <button
                  type="button"
                  onClick={() => toggleReservation(item.id)}
                  className={`cursor-pointer w-full text-center py-2 text-xs font-bold rounded-lg transition-all ${
                    item.reserved
                      ? "bg-stone-200 hover:bg-stone-300 text-stone-700"
                      : "bg-cars-blue hover:bg-[#0E76BC]/90 text-white shadow-sm"
                  }`}
                >
                  {item.reserved ? "Desfazer Reserva" : "Reservar este Item"}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 text-center text-[11px] text-stone-400 font-mono">
          Nenhuma sugestão é obrigatória! Sua amizade e presença são os maiores prêmios para o Isac! 🏆
        </div>
      </div>

      {/* Reservation name prompter Modal */}
      <AnimatePresence>
        {activeItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white max-w-sm w-full rounded-2xl overflow-hidden border-4 border-cars-blue shadow-2xl p-6 relative text-stone-900"
            >
              <h4 className="font-display text-lg text-cars-blue uppercase tracking-wide flex items-center gap-1.5 mb-1">
                <Gift className="w-5 h-5 text-cars-blue" />
                RESERVAR CATEGORIA
              </h4>
              <p className="text-xs text-stone-500 mb-4 font-semibold uppercase font-mono">
                {activeItem.category}
              </p>

              <form onSubmit={handleConfirmReservation} className="space-y-4">
                <div>
                  <label className="block font-mono text-xs font-bold text-stone-500 mb-1">
                    SEU NOME PARA A LISTA
                  </label>
                  <input
                    type="text"
                    required
                    value={reserveName}
                    onChange={(e) => setReserveName(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full bg-stone-50 border-2 border-stone-200 focus:border-cars-blue focus:bg-white rounded-xl px-4 py-2.5 text-sm font-semibold outline-none"
                  />
                  <p className="text-[10px] text-stone-400 font-mono mt-1">
                    Isso ajuda a família a ter uma ideia do que o Isac ganhará!
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveItem(null);
                      setReserveName("");
                    }}
                    className="cursor-pointer flex-1 py-2 border border-stone-200 hover:bg-stone-50 text-stone-600 rounded-lg text-xs font-bold uppercase"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    className="cursor-pointer flex-1 py-2 bg-cars-blue hover:bg-[#0E76BC]/95 text-white rounded-lg text-xs font-bold uppercase shadow"
                  >
                    Reservar!
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
