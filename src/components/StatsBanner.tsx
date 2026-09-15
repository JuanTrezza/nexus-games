import React from 'react';

export const StatsBanner: React.FC = () => {
  return (
    <section className="border-y border-purple-500/20 bg-[#131829]/60 backdrop-blur-lg py-8 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          
          <div className="p-4 border-r border-purple-500/15 last:border-0">
            <div className="font-chakra text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300">
              500K+
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-300 mt-1">
              Juegos Catalogados
            </div>
            <div className="text-[10px] font-mono text-purple-400 mt-0.5">
              Base global actualizada
            </div>
          </div>

          <div className="p-4 border-r border-purple-500/15 last:border-0">
            <div className="font-chakra text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              50+
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-300 mt-1">
              Plataformas y Consolas
            </div>
            <div className="text-[10px] font-mono text-cyan-400 mt-0.5">
              PC, PS5, Xbox, Switch & más
            </div>
          </div>

          <div className="p-4 border-r border-purple-500/15 last:border-0">
            <div className="font-chakra text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              200+
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-300 mt-1">
              Géneros y Subgéneros
            </div>
            <div className="text-[10px] font-mono text-emerald-400 mt-0.5">
              RPG, Acción, Tácticos, Indie
            </div>
          </div>

          <div className="p-4">
            <div className="font-chakra text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
              20K+
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-300 mt-1">
              Desarrolladores & Estudios
            </div>
            <div className="text-[10px] font-mono text-pink-400 mt-0.5">
              AAA y desarrollos independientes
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
