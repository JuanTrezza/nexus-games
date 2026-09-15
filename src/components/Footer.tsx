import React from 'react';
import { Gamepad2, Heart, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0A0E1A] border-t border-purple-500/20 pt-16 pb-12 text-slate-400 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-purple-500/15">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500 p-[1.5px]">
                <div className="w-full h-full bg-[#0A0E1A] rounded-[6.5px] flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <div className="font-chakra text-2xl font-bold tracking-wider text-white">
                NEXUS <span className="text-cyan-400 text-xs px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 font-mono">GAMES</span>
              </div>
            </div>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              La plataforma definitiva para amantes de los videojuegos. Explorá títulos AAA e independientes con datos precisos, críticas de la prensa y capturas en alta fidelidad.
            </p>

            <div className="pt-2">
              <a
                href="https://rawg.io/apidocs"
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#131829] border border-purple-500/30 text-xs font-mono text-slate-300 hover:text-white transition"
              >
                <span>Datos provistos por RAWG.io API</span>
                <ExternalLink className="w-3 h-3 text-cyan-400" />
              </a>
            </div>
          </div>

          {/* Nav column 1 */}
          <div>
            <h4 className="font-chakra font-bold text-white text-sm uppercase tracking-wider mb-4">
              Navegación
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('hero')}
                  className="hover:text-cyan-400 transition cursor-pointer"
                >
                  Inicio
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('explorar')}
                  className="hover:text-purple-400 transition cursor-pointer"
                >
                  Catálogo Completo
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('generos')}
                  className="hover:text-cyan-400 transition cursor-pointer"
                >
                  Géneros Populares
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('plataformas')}
                  className="hover:text-purple-400 transition cursor-pointer"
                >
                  Plataformas y Consolas
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('tendencias')}
                  className="hover:text-amber-400 transition cursor-pointer"
                >
                  Trending Games
                </button>
              </li>
            </ul>
          </div>

          {/* Legal / API column */}
          <div>
            <h4 className="font-chakra font-bold text-white text-sm uppercase tracking-wider mb-4">
              Plataforma
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <a
                  href="https://rawg.io"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="hover:text-white transition flex items-center gap-1"
                >
                  RAWG.io Database <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://metacritic.com"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="hover:text-white transition flex items-center gap-1"
                >
                  Metacritic Ratings <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <span className="text-slate-500">Privacidad y Cookies</span>
              </li>
              <li>
                <span className="text-slate-500">Términos de Servicio</span>
              </li>
            </ul>
          </div>

          {/* Community column */}
          <div>
            <h4 className="font-chakra font-bold text-white text-sm uppercase tracking-wider mb-4">
              Comunidad
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <span className="hover:text-white cursor-pointer transition flex items-center gap-1.5">
                  👾 Discord Oficial
                </span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition flex items-center gap-1.5">
                  🌐 Reddit /r/NexusGames
                </span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition flex items-center gap-1.5">
                  🕹️ Steam Curators
                </span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition flex items-center gap-1.5">
                  ⚡ Twitter / X Nexus
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div>
            © {new Date().getFullYear()} NEXUS GAMES. Todos los derechos reservados.
          </div>
          <div className="flex items-center gap-1">
            Diseñado con pasión para gamers <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 ml-1" />
          </div>
        </div>

      </div>
    </footer>
  );
};
