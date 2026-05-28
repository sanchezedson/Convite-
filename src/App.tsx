/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Trophy, 
  Car, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Gift, 
  Volume2, 
  CheckCircle, 
  X, 
  Flag, 
  Sparkles,
  Music,
  UserCheck,
  Send
} from "lucide-react";
import { GuestRSVP, GiftItem } from "./types";
import { carsAudio } from "./audio";

// Import custom components
import Countdown from "./components/Countdown";
import LocationCard from "./components/LocationCard";
import CharacterGreetings from "./components/CharacterGreetings";

// Live assets paths
const redRacecarBg = "/src/assets/images/red_racecar_background_1780010248603.png";
const pistonTrophy = "/src/assets/images/piston_trophy_1780010269021.png";

// Initial suggestions for Isac's 2nd birthday wishlist
const INITIAL_GIFTS: GiftItem[] = [
  { id: "1", category: "Brinquedos", suggestion: "Pista de Corrida da Disney Cars", reserved: false },
  { id: "2", category: "Brinquedos", suggestion: "Carrinho de Controle Remoto do Relâmpago McQueen", reserved: false },
  { id: "3", category: "Vestuário", suggestion: "Camiseta temática Carros (tamanho 2-3 anos)", reserved: false },
  { id: "4", category: "Vestuário", suggestion: "Tênis do Relâmpago McQueen (Nº 22/23)", reserved: false },
  { id: "5", category: "Educativos", suggestion: "Livro de colorir gigante com canetinhas mágicas", reserved: false },
  { id: "6", category: "Brinquedos", suggestion: "Blocos de montar grandes / Lego Duplo", reserved: false },
];

export default function App() {
  const [rsvps, setRsvps] = useState<GuestRSVP[]>([]);
  const [gifts, setGifts] = useState<GiftItem[]>([]);
  
  // RSVP Form States
  const [guestName, setGuestName] = useState("");
  const [attending, setAttending] = useState<boolean | null>(null);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [plate, setPlate] = useState("");
  const [rsvpMessage, setRsvpMessage] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Gift reservation States
  const [selectedGiftId, setSelectedGiftId] = useState<string | null>(null);
  const [reserverName, setReserverName] = useState("");

  // Music/Engine ambient loop simulated play state indicator
  const [muffledEngineLoop, setMuffledEngineLoop] = useState(false);

  useEffect(() => {
    // Load RSVPs and Gifts from localStorage
    const savedRsvps = localStorage.getItem("isac_gp_rsvps");
    if (savedRsvps) {
      setRsvps(JSON.parse(savedRsvps));
    } else {
      const initialRsvps: GuestRSVP[] = [
        {
          id: "demo1",
          name: "Primo Davi",
          attending: true,
          adultsCount: 2,
          childrenCount: 1,
          plateText: "DAVI-03",
          submissionDate: new Date().toLocaleDateString("pt-BR"),
          message: "Katchow! Eu vou acelerar muito com você, Isac!",
        },
        {
          id: "demo2",
          name: "Tia Regina",
          attending: true,
          adultsCount: 1,
          childrenCount: 0,
          plateText: "REGI-GP",
          submissionDate: new Date().toLocaleDateString("pt-BR"),
          message: "Parabéns, Isac lindo! Estarei presente com certeza!",
        }
      ];
      setRsvps(initialRsvps);
      localStorage.setItem("isac_gp_rsvps", JSON.stringify(initialRsvps));
    }

    const savedGifts = localStorage.getItem("isac_gp_gifts");
    if (savedGifts) {
      setGifts(JSON.parse(savedGifts));
    } else {
      setGifts(INITIAL_GIFTS);
      localStorage.setItem("isac_gp_gifts", JSON.stringify(INITIAL_GIFTS));
    }
  }, []);

  const saveRsvpsToStorage = (updatedList: GuestRSVP[]) => {
    setRsvps(updatedList);
    localStorage.setItem("isac_gp_rsvps", JSON.stringify(updatedList));
  };

  const handleRsvpSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;
    if (attending === null) return;

    const newRsvp: GuestRSVP = {
      id: "rsvp_" + Date.now(),
      name: guestName.trim(),
      attending: attending,
      adultsCount: attending ? adults : 0,
      childrenCount: attending ? children : 0,
      plateText: plate.trim() ? plate.trim().toUpperCase() : `${guestName.substring(0,4).toUpperCase()}-02`,
      submissionDate: new Date().toLocaleDateString("pt-BR"),
      message: rsvpMessage.trim() || undefined,
    };

    const updated = [newRsvp, ...rsvps];
    saveRsvpsToStorage(updated);
    
    // Play sound on submit
    if (attending) {
      carsAudio.playSuccessFanfare();
      carsAudio.playEngineRev();
    } else {
      carsAudio.playHonk();
    }

    setSubmitSuccess(true);
    setTimeout(() => {
      // Reset form
      setGuestName("");
      setAttending(null);
      setAdults(1);
      setChildren(0);
      setPlate("");
      setRsvpMessage("");
      setSubmitSuccess(false);
    }, 4500);
  };

  const deleteRsvp = (id: string) => {
    const updated = rsvps.filter((item) => item.id !== id);
    saveRsvpsToStorage(updated);
    carsAudio.playHonk();
  };

  const handleReserveGift = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedGiftId || !reserverName.trim()) return;

    const updated = gifts.map((item) => {
      if (item.id === selectedGiftId) {
        return {
          ...item,
          reserved: true,
          reservedBy: reserverName.trim(),
        };
      }
      return item;
    });

    setGifts(updated);
    localStorage.setItem("isac_gp_gifts", JSON.stringify(updated));
    setSelectedGiftId(null);
    setReserverName("");
    carsAudio.playSuccessFanfare();
  };

  const handleReleaseGift = (id: string) => {
    const updated = gifts.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          reserved: false,
          reservedBy: undefined,
        };
      }
      return item;
    });

    setGifts(updated);
    localStorage.setItem("isac_gp_gifts", JSON.stringify(updated));
    carsAudio.playHonk();
  };

  const totalConfirmedPilots = rsvps
    .filter((r) => r.attending)
    .reduce((acc, curr) => acc + curr.adultsCount + curr.childrenCount, 0);

  const totalAdults = rsvps
    .filter((r) => r.attending)
    .reduce((acc, curr) => acc + curr.adultsCount, 0);

  const totalChildren = rsvps
    .filter((r) => r.attending)
    .reduce((acc, curr) => acc + curr.childrenCount, 0);

  // Function to create top/bottom checkerboard items dynamically
  const renderCheckerboard = (count = 32) => {
    return Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className={`w-10 h-10 ${i % 2 === 0 ? "bg-black" : "bg-white"} shrink-0`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-stone-900 flex flex-col font-sans selection:bg-cars-yellow selection:text-black">
      
      {/* Dynamic Sound Action bar at the very top */}
      <div className="bg-cars-dark text-white border-b border-stone-800 text-xs px-4 py-2.5 flex justify-between items-center z-50">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping"></span>
          <span className="font-mono text-[10px] sm:text-xs text-stone-300 font-extrabold tracking-widest uppercase">
            CONVITE DE ANIVERSÁRIO INTERATIVO
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              carsAudio.playEngineRev();
              setMuffledEngineLoop(true);
            }}
            className="cursor-pointer font-mono font-black text-[10px] bg-cars-red hover:bg-red-700 active:scale-95 text-white py-1 px-3 rounded-full flex items-center gap-1.5 transition-all shadow"
          >
            <Volume2 className="w-3.5 h-3.5" />
            Vruum!
          </button>
          
          <button
            onClick={() => {
              carsAudio.playHonk();
            }}
            className="cursor-pointer font-mono font-black text-[10px] bg-cars-yellow hover:bg-yellow-400 active:scale-95 text-black py-1 px-3 rounded-full flex items-center gap-1.5 transition-all shadow"
          >
            📢 Buzinar!
          </button>
        </div>
      </div>

      {/* TOP Checkerboard Border Ribbons - Essential to Artistic Flair */}
      <div className="h-10 w-full flex overflow-hidden bg-black border-b-4 border-black">
        {renderCheckerboard(48)}
      </div>

      {/* Hero Header Poster - Artistic Flair Banner Container */}
      <header className="relative bg-gradient-to-b from-cars-red via-red-600 to-red-700 py-16 px-4 md:px-8 text-center overflow-hidden border-b-8 border-black">
        
        {/* Decorative ambient speed lines in the background */}
        <div className="absolute inset-0 opacity-15 pointer-events-none mix-blend-overlay bg-checkered"></div>
        
        {/* Floating Cars Disney Red car background placed as artistic vintage framed poster */}
        <div className="absolute bottom-2 right-2 md:bottom-6 md:right-12 w-48 md:w-80 opacity-40 md:opacity-25 pointer-events-none transform rotate-12 scale-110">
          <img 
            src={redRacecarBg} 
            alt="Red Race Car Decor" 
            className="w-full object-contain filter drop-shadow-[5px_5px_0_rgba(0,0,0,0.8)]"
          />
        </div>

        {/* Floating Number 95 element */}
        <div className="absolute bottom-4 left-6 md:left-20 opacity-20 pointer-events-none">
          <span className="text-white text-[120px] md:text-[220px] font-display italic leading-none">95</span>
        </div>

        {/* Floating Katchau styling banner */}
        <div className="absolute top-8 right-6 md:right-24 transform rotate-12 z-15 scale-90 md:scale-100">
          <div className="bg-white text-black font-display text-lg md:text-2xl px-5 py-2.5 rounded-2xl border-4 border-black shadow-[6px_6px_0_#FAD107] hover:scale-105 transition-transform cursor-pointer"
               onClick={() => {
                 carsAudio.playEngineRev();
               }}>
            KATCHAU! ⚡
          </div>
        </div>

        {/* Lightning Bolt Icon (SVG Styled like Theme) */}
        <motion.div 
          initial={{ scale: 0.8, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 120 }}
          className="mb-3 inline-block"
        >
          <svg 
            width="90" 
            height="90" 
            viewBox="0 0 24 24" 
            fill="#FAD107" 
            stroke="black" 
            strokeWidth="2"
            className="filter drop-shadow-[0_4px_0_rgba(0,0,0,1)] hover:scale-115 transition-transform cursor-pointer"
            onClick={() => carsAudio.playStarterBeep(true)}
          >
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </motion.div>

        {/* Title Section matching the exact Artistic Flair styling instructions */}
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-block transform -rotate-1 mb-2">
            <span className="text-white uppercase font-black italic tracking-tighter text-2xl md:text-4xl block leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
              🏁 APERTE OS CINTOS! 🏁
            </span>
          </div>

          <h1 className="text-cars-yellow text-5xl sm:text-7xl md:text-[140px] font-display italic leading-none drop-shadow-[0_8px_0_rgba(0,0,0,1)] uppercase tracking-tight select-none">
            ISAC <span className="text-white drop-shadow-[0_8px_0_rgba(0,0,0,1)]">FAZ 2</span>
          </h1>

          <div className="mt-6">
            <p className="text-white font-mono font-black text-lg md:text-2xl tracking-wide bg-neutral-950 px-8 py-3.5 rounded-full inline-block border-4 border-white shadow-xl max-w-full">
              ⚡ A GRANDE CORRIDA VAI COMEÇAR! ⚡
            </p>
          </div>

          <p className="text-white font-medium text-xs sm:text-sm mt-4 bg-black/40 px-4 py-1.5 rounded-full inline-flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-cars-yellow" />
            Tema oficial: Carros Disney-Pixar com Copa Piston!
          </p>
        </div>
      </header>

      {/* THREE DETAIL DASHBOARD CARS - Exact arrangement & rotation from requested instructions */}
      <section className="bg-amber-400 py-10 px-4 border-b-8 border-black shadow-inner">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-8 justify-center items-stretch">
          
          {/* Card 1: Date (rotated left, white bg, black 4px border) */}
          <motion.div 
            whileHover={{ scale: 1.05, rotate: -1 }}
            className="cursor-pointer bg-white border-4 border-black p-6 flex flex-col items-center justify-center rounded-2xl shadow-[6px_6px_0_#000] transform md:-rotate-2 relative overflow-hidden transition-all text-center min-h-[170px]"
          >
            <div className="absolute top-0 inset-x-0 h-3 bg-cars-red"></div>
            <Calendar className="w-8 h-8 text-cars-red mb-1.5" />
            <span className="text-cars-red font-black text-xs uppercase tracking-widest font-mono">CALENDÁRIO</span>
            <span className="text-black text-4xl sm:text-5xl font-display leading-none mt-1">01 / AGO</span>
            <span className="text-black text-lg font-bold mt-1 font-mono uppercase">2026 (Sábado)</span>
          </motion.div>

          {/* Card 2: Time (scaled, yellow/black contrast, central z-20 layout) */}
          <motion.div 
            whileHover={{ scale: 1.12, rotate: 1 }}
            className="cursor-pointer bg-cars-yellow border-4 border-black p-6 flex flex-col items-center justify-center rounded-2xl shadow-[8px_8px_0_#000] z-20 scale-100 md:scale-110 relative overflow-hidden transition-all text-center min-h-[170px]"
          >
            <div className="absolute -right-4 -top-4 w-12 h-12 bg-black rotate-45"></div>
            <Clock className="w-8 h-8 text-black mb-1.5" />
            <span className="text-black font-mono font-black text-xs uppercase tracking-widest">LARGADA (BOXES)</span>
            <span className="text-neutral-900 text-5xl sm:text-6xl font-display leading-none mt-1">16:00H</span>
            <span className="text-black text-[10px] font-black font-mono bg-white px-2.5 py-0.5 rounded-full mt-2 border border-black uppercase tracking-widest">
              HORÁRIO DE BRASÍLIA
            </span>
          </motion.div>

          {/* Card 3: Location (rotated right, white bg, black 4px border) */}
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 1 }}
            className="cursor-pointer bg-white border-4 border-black p-6 flex flex-col items-center justify-center rounded-2xl shadow-[6px_6px_0_#000] transform md:rotate-2 relative overflow-hidden transition-all text-center min-h-[170px]"
          >
            <div className="absolute top-0 inset-x-0 h-3 bg-cars-blue"></div>
            <MapPin className="w-8 h-8 text-cars-blue mb-1.5" />
            <span className="text-cars-blue font-black text-xs uppercase tracking-widest font-mono">PIT STOP (LOCAL)</span>
            <span className="text-black text-2xl sm:text-3xl font-display leading-tight mt-1 uppercase">FOGÃO MINEIRO</span>
            <span className="text-stone-700 text-sm font-extrabold mt-1 uppercase">CAMPINAS / SOUSAS</span>
          </motion.div>

        </div>
      </section>

      {/* MAIN APPLICATION MODULES SECTION */}
      <main className="flex-1 bg-stone-100">
        
        {/* Banner with Trophy & Custom interactive welcome alert */}
        <div className="max-w-6xl mx-auto pt-10 px-4">
          <div className="bg-gradient-to-r from-neutral-800 to-neutral-950 text-white rounded-3xl border-4 border-cars-yellow p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-1/4 w-32 h-32 bg-cars-yellow/10 rounded-full blur-2xl"></div>
            
            {/* Immersive piston visual built in image asset tool */}
            <div className="w-24 sm:w-28 shrink-0 bg-stone-900 border-2 border-stone-700 p-2.5 rounded-2xl shadow-xl flex items-center justify-center">
              <img 
                src={pistonTrophy} 
                alt="Piston Cup Trophy" 
                className="w-full h-auto object-contain filter drop-shadow-[0_4px_6px_rgba(250,209,7,0.4)] animate-bounce"
              />
            </div>

            <div className="grow text-center md:text-left">
              <span className="bg-cars-yellow text-black text-[10px] font-black font-mono uppercase px-2.5 py-1 rounded tracking-widest">
                PRÊMIO COPA PISTON DE ANIVERSÁRIO
              </span>
              <h2 className="font-display text-2xl sm:text-3xl text-white tracking-wide mt-2">
                O CAMPEONATO DOS 2 ANOS!
              </h2>
              <p className="text-stone-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
                Nesta etapa especial, a diversão acontece no tradicional restaurante <strong className="text-white">Fogão Mineiro Campinas</strong>! 
                Preparamos uma pista com brinquedos ecológicos, comida típica deliciosa para os adultos, 
                e docinhos dignos de uma linha de chegada. Traga toda a sua energia para dar voltas rápidas com o Isac!
              </p>
            </div>
            
            <div className="shrink-0 font-mono text-center bg-stone-900/60 p-4 border border-stone-800 rounded-2xl self-stretch md:self-auto flex flex-col justify-center">
              <div className="text-cars-yellow text-2xl font-black italic">CAMPINAS</div>
              <div className="text-slate-400 text-[10px] font-bold">CIRC. SOUSAS</div>
            </div>
          </div>
        </div>

        {/* SECTION FOR TIMELINE SCHEDULE & COUNTDOWN CLOCK */}
        <div className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Block: The Interactive Roadmap Timeline */}
          <div className="lg:col-span-7">
            <LocationCard />
          </div>

          {/* Right Block: Live Countdown Speed clock & Weather details */}
          <div className="lg:col-span-5 space-y-6">
            <Countdown />
            
            {/* Champion Bio Mini-Card with sound actions */}
            <div className="bg-stone-900 text-white rounded-2xl border-4 border-black p-5 relative overflow-hidden shadow-lg">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cars-red via-cars-yellow to-cars-blue"></div>
              
              <div className="flex items-center gap-4">
                <div className="text-4xl bg-stone-850 p-2.5 rounded-xl border border-stone-800">🏎️</div>
                <div>
                  <h4 className="font-display text-lg text-white tracking-widest">PILOTO DO DIA: ISAC #02</h4>
                  <p className="text-xs text-stone-400 font-mono uppercase font-black">2 ANOS DE MUITA VELOCIDADE</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs font-mono">
                <div className="bg-stone-950 p-2 rounded-xl border border-stone-850">
                  <span className="text-stone-500 block">DORSAL</span>
                  <strong className="text-cars-red text-base">#02</strong>
                </div>
                <div className="bg-stone-950 p-2 rounded-xl border border-stone-850">
                  <span className="text-stone-500 block">DIFERENÇA GP</span>
                  <strong className="text-cars-yellow text-base">+2 ANOS</strong>
                </div>
              </div>

              <div className="mt-4 pt-3.5 border-t border-stone-800/80 text-center">
                <p className="text-[11px] text-stone-400 italic">"Se você tem um sonho, acelere e vá atrás dele!" — Relâmpago McQueen</p>
              </div>
            </div>
          </div>

        </div>

        {/* CHARACTER MESSAGES WIDGET */}
        <section className="max-w-6xl mx-auto px-4 mt-8">
          <CharacterGreetings />
        </section>

        {/* LIVE RSVP INTERACTIVE FORM MODULE */}
        <section className="max-w-6xl mx-auto px-4 mt-8 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Col 1: Registration Form (7 columns wide) */}
          <div className="lg:col-span-7 flex flex-col">
            <div id="rsvp-form" className="bg-white rounded-2xl border-4 border-black shadow-xl overflow-hidden flex flex-col justify-between h-full relative">
              
              {/* Header */}
              <div className="bg-black text-white px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="font-display text-xl text-cars-yellow uppercase tracking-wider flex items-center gap-2">
                    <Flag className="w-5 h-5 text-cars-yellow" />
                    CONFIRMAR PRESENÇA NO CORREDOR!
                  </h3>
                  <p className="text-[10px] sm:text-xs text-stone-400 font-mono uppercase font-black">PREENCHA OS DADOS DO SEU VEÍCULO</p>
                </div>
                <span className="text-xs bg-cars-red text-white py-1 px-2.5 rounded font-bold font-mono">RSVP</span>
              </div>

              {/* Form elements */}
              <div className="p-6 grow flex flex-col justify-center">
                
                <AnimatePresence mode="wait">
                  {submitSuccess ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-10 px-4"
                    >
                      <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-10 h-10" />
                      </div>
                      <h4 className="font-display text-2xl text-stone-900 uppercase">DADOS TRANSMITIDOS AOS BOXES!</h4>
                      <p className="text-xs text-stone-600 font-bold font-mono mt-2 tracking-widest uppercase text-green-600">
                        Sua licença de corrida foi aprovada com sucesso!
                      </p>
                      
                      <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 mt-6 max-w-md mx-auto text-center font-mono text-xs">
                        <p className="font-black text-stone-800">🚦 CONFIRMAÇÃO GRANDE PRÊMIO DO ISAC</p>
                        <p className="text-stone-500 mt-1">Data: 01/08/2026 às 16:00h</p>
                        <p className="text-cars-blue mt-0.5">Local: Fogão Mineiro Campinas (Campinas-SP)</p>
                      </div>

                      <div className="mt-8 text-xs text-stone-400">
                        Preparando o painel de bordo para novos registros...
                      </div>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleRsvpSubmit} className="space-y-4">
                      
                      {/* Name input */}
                      <div>
                        <label className="block text-xs font-mono font-black text-stone-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                          <span>Nome Completo do Piloto</span>
                          <span className="text-cars-red">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          placeholder="Ex: João Silva ou Família Oliveira"
                          className="w-full bg-stone-50 px-4 py-3 rounded-xl border-2 border-stone-300 focus:border-cars-red focus:bg-white text-stone-900 font-medium text-sm outline-none transition-colors"
                        />
                      </div>

                      {/* Presence Choice */}
                      <div>
                        <label className="block text-xs font-mono font-black text-stone-600 uppercase tracking-wider mb-2">
                          Você vai alinhar no Grid de Largada? *
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              setAttending(true);
                              carsAudio.playEngineRev();
                            }}
                            className={`cursor-pointer font-display py-3 px-4 rounded-xl text-center border-3 text-sm transition-all flex items-center justify-center gap-2 ${
                              attending === true
                                ? "bg-green-500 border-green-700 text-white font-black shadow-md scale-102"
                                : "bg-stone-100 border-stone-300 hover:border-stone-400 text-stone-700"
                            }`}
                          >
                            🟢 SIM, VOU ACELERAR!
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setAttending(false);
                              carsAudio.playHonk();
                            }}
                            className={`cursor-pointer font-display py-3 px-4 rounded-xl text-center border-3 text-sm transition-all flex items-center justify-center gap-2 ${
                              attending === false
                                ? "bg-red-500 border-red-700 text-white font-black shadow-md scale-102"
                                : "bg-stone-100 border-stone-300 hover:border-stone-400 text-stone-700"
                            }`}
                          >
                            🔴 NÃO PODEREI IR
                          </button>
                        </div>
                      </div>

                      {attending === true && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="space-y-4 pt-2 border-t border-stone-200"
                        >
                          {/* Guests count */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-mono font-black text-stone-600 uppercase mb-1.5">
                                Quantidade de Adultos
                              </label>
                              <div className="flex items-center gap-2 bg-stone-50 p-1.5 rounded-xl border-2 border-stone-350">
                                <button
                                  type="button"
                                  onClick={() => { setAdults(Math.max(1, adults - 1)); carsAudio.playStarterBeep(false); }}
                                  className="cursor-pointer bg-white w-8 h-8 rounded-lg flex items-center justify-center border font-bold text-stone-700 hover:bg-stone-100"
                                >
                                  -
                                </button>
                                <span className="grow text-center font-mono font-bold text-sm">{adults}</span>
                                <button
                                  type="button"
                                  onClick={() => { setAdults(adults + 1); carsAudio.playStarterBeep(false); }}
                                  className="cursor-pointer bg-white w-8 h-8 rounded-lg flex items-center justify-center border font-bold text-stone-700 hover:bg-stone-100"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-xs font-mono font-black text-stone-600 uppercase mb-1.5">
                                Quantidade de Crianças
                              </label>
                              <div className="flex items-center gap-2 bg-stone-50 p-1.5 rounded-xl border-2 border-stone-350">
                                <button
                                  type="button"
                                  onClick={() => { setChildren(Math.max(0, children - 1)); carsAudio.playStarterBeep(false); }}
                                  className="cursor-pointer bg-white w-8 h-8 rounded-lg flex items-center justify-center border font-bold text-stone-700 hover:bg-stone-100"
                                >
                                  -
                                </button>
                                <span className="grow text-center font-mono font-bold text-sm">{children}</span>
                                <button
                                  type="button"
                                  onClick={() => { setChildren(children + 1); carsAudio.playStarterBeep(false); }}
                                  className="cursor-pointer bg-white w-8 h-8 rounded-lg flex items-center justify-center border font-bold text-stone-700 hover:bg-stone-100"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Custom License Plate Text decoration */}
                          <div>
                            <label className="block text-xs font-mono font-black text-stone-600 uppercase mb-1 flex justify-between">
                              <span>Texto da sua Placa Racing (Opcional)</span>
                              <span className="text-stone-400 font-medium">Ex: SILVA-26</span>
                            </label>
                            <input
                              type="text"
                              maxLength={8}
                              value={plate}
                              onChange={(e) => setPlate(e.target.value.toUpperCase())}
                              placeholder="Placa personalizada para o Starting Grid"
                              className="w-full bg-stone-50 px-4 py-2.5 rounded-xl border-2 border-stone-300 uppercase font-mono text-sm tracking-widest outline-none text-stone-900 focus:border-cars-blue focus:bg-white"
                            />
                          </div>
                        </motion.div>
                      )}

                      {/* Msg */}
                      <div>
                        <label className="block text-xs font-mono font-black text-stone-600 uppercase mb-1.5">
                          Mensagem de Carinho para o Isac (Opcional)
                        </label>
                        <textarea
                          rows={2}
                          value={rsvpMessage}
                          onChange={(e) => setRsvpMessage(e.target.value)}
                          placeholder="Escreva uma mensagem cheia de energia positiva..."
                          className="w-full bg-stone-50 px-4 py-2.5 rounded-xl border-2 border-stone-300 focus:border-cars-red focus:bg-white text-stone-900 font-medium text-xs outline-none transition-colors"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={attending === null}
                        className={`cursor-pointer w-full py-4 rounded-xl font-display text-white text-base shadow-md transition-all tracking-wider ${
                          attending !== null
                            ? "bg-cars-red hover:bg-red-700 active:scale-98 cursor-pointer"
                            : "bg-stone-300 cursor-not-allowed text-stone-500"
                        }`}
                      >
                        ⚡ ENVIAR FICHA DE PILOTO 🏁
                      </button>

                    </form>
                  )}
                </AnimatePresence>
                
              </div>

              {/* Checkered Footer of the card */}
              <div className="bg-checkered-light h-4 py-1.5 opacity-60"></div>
            </div>
          </div>

          {/* Col 2: Telemetry Standings Grid list (5 columns wide) */}
          <div className="lg:col-span-5 flex flex-col">
            <div id="rsvp-telemetry" className="bg-stone-900 rounded-2xl border-4 border-black text-white p-5 shadow-xl flex flex-col justify-between grow relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-cars-red opacity-10 rounded-full blur-xl"></div>
              
              <div>
                <h3 className="font-display text-lg text-cars-yellow tracking-widest flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-cars-yellow" />
                  STARTING GRID (PRESENÇAS)
                </h3>
                <p className="text-[10px] text-stone-400 font-mono uppercase mb-4">TELEMENTRIA EM TEMPO REAL DO EVENTO</p>

                {/* Grid stats */}
                <div className="grid grid-cols-3 gap-2 mb-4 text-center font-mono">
                  <div className="bg-stone-950 p-2 border border-stone-850 rounded-xl">
                    <span className="text-stone-500 block text-[9px] uppercase font-bold">VEÍCULOS/GUESTS</span>
                    <strong className="text-white text-lg">{rsvps.length}</strong>
                  </div>
                  <div className="bg-stone-950 p-2 border border-stone-850 rounded-xl">
                    <span className="text-stone-500 block text-[9px] uppercase font-bold">PILOTOS INTEGRIT</span>
                    <strong className="text-cars-yellow text-lg">{totalConfirmedPilots}</strong>
                  </div>
                  <div className="bg-stone-950 p-2 border border-stone-850 rounded-xl">
                    <span className="text-stone-500 block text-[9px] uppercase font-bold">BOXES (CRIANÇAS)</span>
                    <strong className="text-cars-blue text-lg">{totalChildren}</strong>
                  </div>
                </div>

                {/* List scroll */}
                <div className="space-y-2 mt-2 max-h-[305px] overflow-y-auto pr-1 customize-scroll">
                  {rsvps.length === 0 ? (
                    <div className="text-center py-10 font-mono text-stone-500 text-xs">
                      Nenhum piloto no box ainda.
                    </div>
                  ) : (
                    rsvps.map((guest, idx) => (
                      <div 
                        key={guest.id}
                        className={`bg-stone-950 p-3 rounded-xl border border-stone-800 ${
                          guest.attending ? "border-l-4 border-l-green-500" : "border-l-4 border-l-red-500"
                        } flex items-center justify-between text-xs font-mono relative group`}
                      >
                        <div className="grow min-w-0 pr-4">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-display text-sm tracking-wider text-stone-150">{guest.name}</span>
                            {guest.attending ? (
                              <span className="text-[10px] text-green-400 font-black">🏁 CONFIRMADO</span>
                            ) : (
                              <span className="text-[10px] text-stone-500 font-black">OUT_BOX</span>
                            )}
                          </div>
                          {guest.attending && (
                            <p className="text-[10px] text-stone-400 mt-0.5">
                              Adultos: {guest.adultsCount} • Crianças: {guest.childrenCount}
                            </p>
                          )}
                          {guest.message && (
                            <p className="text-stone-400 italic text-[11px] mt-1 pl-1 bg-stone-900 border-l border-cars-yellow">
                              "{guest.message}"
                            </p>
                          )}
                        </div>

                        {/* License plate representation badge */}
                        <div className="text-right shrink-0 flex items-center gap-2">
                          {guest.attending && (
                            <div className="bg-white border text-black font-black py-0.5 px-2 rounded-md scale-95 border-black text-[9px] font-mono tracking-widest shadow-sm">
                              {guest.plateText}
                            </div>
                          )}
                          
                          {/* Option to clear demo rsvp items */}
                          <button
                            onClick={() => deleteRsvp(guest.id)}
                            className="text-stone-500 hover:text-cars-red p-1 rounded-md hover:bg-stone-900 opacity-60 group-hover:opacity-100 transition-opacity"
                            title="Remover piloto do grid"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </div>

              <div className="mt-4 pt-3.5 border-t border-stone-850 flex items-center justify-between font-mono text-[9px] text-stone-500">
                <span>LICENÇA DE STARTING GRID AUTOMÁTICA</span>
                <span>V.02-GP</span>
              </div>
            </div>
          </div>

        </section>

        {/* PIT STOP DE PRESENTES - Interactive Suggestion Wishlist */}
        <section className="bg-stone-200 py-12 px-4 border-t-4 border-stone-300">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-block bg-cars-blue text-white px-4 py-1.5 rounded-full text-xs font-mono font-black mb-2 uppercase tracking-widest">
                SUGESTÃO DE COPA DE PRESENTES
              </div>
              <h2 className="font-display text-3xl text-stone-900 tracking-wide uppercase">
                🏁 PIT STOP DE PRESENTES DO ISAC 🏁
              </h2>
              <p className="text-stone-600 text-xs sm:text-sm max-w-2xl mx-auto mt-1">
                Para quem perguntar sobre mimos e presentes para o Isac de 2 anos, criamos uma lista interativa com sugestões especiais! 
                Você pode escolher e "reservar" abaixo um presente para não repetir! 🎁
              </p>
            </div>

            {/* List of gifts in a bento dynamic grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {gifts.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white rounded-xl border-3 border-stone-900 p-5 flex flex-col justify-between transition-all ${
                    item.reserved 
                      ? "opacity-65 bg-stone-50 border-stone-400" 
                      : "hover:scale-102 hover:shadow-md"
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded ${
                        item.reserved ? "bg-stone-200 text-stone-500" : "bg-cars-blue/10 text-cars-blue"
                      }`}>
                        {item.category}
                      </span>
                      <Gift className={`w-4 h-4 ${item.reserved ? "text-stone-400" : "text-cars-blue"}`} />
                    </div>
                    
                    <h4 className={`text-sm font-bold text-stone-900 ${item.reserved ? "line-through text-stone-500" : ""}`}>
                      {item.suggestion}
                    </h4>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                    {item.reserved ? (
                      <div className="w-full flex items-center justify-between text-xs font-mono text-stone-500">
                        <span>Reservado por: <strong>{item.reservedBy}</strong></span>
                        <button
                          onClick={() => handleReleaseGift(item.id)}
                          className="cursor-pointer text-[10px] text-cars-red underline font-bold"
                        >
                          Liberar
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedGiftId(item.id);
                          carsAudio.playStarterBeep(false);
                        }}
                        className="cursor-pointer w-full text-center bg-cars-blue hover:bg-cars-blue/95 transition-all text-white py-1.5 rounded-lg border-2 border-black font-display text-xs tracking-wider uppercase"
                      >
                        🎁 RESERVAR SUGESTÃO
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Simulated RSVP tips banner inside Registry section */}
            <div className="mt-8 bg-amber-100 border-2 border-amber-400 text-amber-900 p-4 rounded-xl text-xs sm:text-sm font-mono flex items-start gap-3">
              <span className="text-xl">💡</span>
              <div>
                <strong className="block mb-0.5 font-bold">INFORMAÇÃO IMPORTANTE PARA OS NOBRES PILOTOS:</strong>
                Caso prefira presentear em dinheiro de forma sutil, nossa <strong>Chave Pix</strong> dos papais do Isac também estará à disposição no dia ou no whatsapp! O mais importante para nós é sua aceleração e alegria juntinho conosco nesta tarde de festa! 
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* GIFT RESERVATION DIALOG MODAL SIMULATION */}
      <AnimatePresence>
        {selectedGiftId && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl border-4 border-black max-w-md w-full p-6 shadow-2xl relative overflow-hidden"
            >
              <button
                onClick={() => { setSelectedGiftId(null); carsAudio.playHonk(); }}
                className="absolute top-4 right-4 text-stone-500 hover:text-black p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-4">
                <div className="w-12 h-12 rounded-full bg-cars-blue/10 flex items-center justify-center mx-auto mb-2 text-cars-blue">
                  <Gift className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl text-stone-900 uppercase">RESERVAR SUGESTÃO</h3>
                <p className="text-xs text-stone-500 mt-1">
                  Você está reservando:
                  <strong className="block text-stone-800 text-sm mt-0.5 italic">
                    "{gifts.find(g => g.id === selectedGiftId)?.suggestion}"
                  </strong>
                </p>
              </div>

              <form onSubmit={handleReserveGift} className="space-y-4 font-mono text-xs">
                <div>
                  <label className="block text-stone-600 font-bold mb-1">Seu Nome Completo:</label>
                  <input
                    type="text"
                    required
                    value={reserverName}
                    onChange={(e) => setReserverName(e.target.value)}
                    placeholder="Escreva seu nome para podermos saber!"
                    className="w-full bg-stone-50 px-4 py-2.5 rounded-xl border-2 border-stone-300 text-sm text-stone-900 focus:bg-white outline-none"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setSelectedGiftId(null); carsAudio.playHonk(); }}
                    className="cursor-pointer w-1/2 py-2.5 bg-stone-100 hover:bg-stone-200 rounded-xl border border-stone-300 font-bold text-stone-600 transition-colors"
                  >
                    CANCELAR
                  </button>
                  <button
                    type="submit"
                    className="cursor-pointer w-1/2 py-2.5 bg-cars-blue hover:bg-cars-blue/95 rounded-xl text-white font-bold transition-colors border-2 border-black"
                  >
                    CONFIRMAR
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FOOTER SECTION: Dynamic Asphalt Road Design Block from Theme instructions with Yellow Road Lines */}
      <footer className="mt-auto">
        
        {/* Checkered Border Middle division */}
        <div className="h-6 w-full flex overflow-hidden bg-black">
          {renderCheckerboard(32)}
        </div>

        {/* Asphalt layer from the Design Theme */}
        <div className="h-24 bg-zinc-850 w-full flex items-center justify-center border-t-8 border-black relative overflow-hidden">
          <div className="absolute inset-0 bg-checkered opacity-5 pointer-events-none"></div>
          
          {/* Animated road markings */}
          <div className="w-full flex gap-12 px-6 sm:px-12 justify-around opacity-90 select-none">
            <div className="h-4 w-16 sm:w-24 bg-cars-yellow shrink-0 rounded"></div>
            <div className="h-4 w-16 sm:w-24 bg-cars-yellow shrink-0 rounded"></div>
            <div className="h-4 w-16 sm:w-24 bg-cars-yellow shrink-0 rounded"></div>
            <div className="h-4 w-16 sm:w-24 bg-cars-yellow shrink-0 rounded"></div>
            <div className="h-4 w-16 sm:w-24 bg-cars-yellow shrink-0 rounded hidden md:block"></div>
            <div className="h-4 w-16 sm:w-24 bg-cars-yellow shrink-0 rounded hidden md:block"></div>
          </div>
        </div>

        {/* Bottom copyright & information ribbon */}
        <div className="bg-stone-950 text-stone-400 py-6 px-4 text-center text-xs font-mono border-t border-stone-850">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-bold flex items-center gap-1.5">
              <span>⚡ GRANDE PRÊMIO DO ISAC #02 COMEMORAÇÃO</span>
            </p>
            <p className="text-[10px] text-stone-500">
              01 de Agosto de 2026 • Fogão Mineiro, Campinas-SP. Desenvolvido com carinho e velocidade • Copa Piston ©
            </p>
          </div>
        </div>

      </footer>

    </div>
  );
}
