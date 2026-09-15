/**
 * Funciones de formateo y utilidades visuales para la interfaz de Nexus Games
 */

/**
 * Retorna un emoji representativo según el slug de la plataforma de juego
 */
export function getPlatformIcon(slug?: string): string {
  if (!slug) return '🎮';
  const s = slug.toLowerCase();
  if (s.includes('pc') || s.includes('windows')) return '💻';
  if (s.includes('playstation') || s.includes('ps')) return '🎮';
  if (s.includes('xbox')) return '🎯';
  if (s.includes('nintendo') || s.includes('switch')) return '🕹️';
  if (s.includes('ios') || s.includes('apple') || s.includes('mac')) return '🍎';
  if (s.includes('android')) return '🤖';
  if (s.includes('linux')) return '🐧';
  return '👾';
}

/**
 * Retorna las clases de color de Tailwind para la insignia de calificación Metacritic
 */
export function getMetacriticColor(score: number | null): string {
  if (!score) return 'bg-slate-800/80 text-slate-400 border-slate-700';
  if (score >= 75) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
  if (score >= 50) return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
  return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
}

/**
 * Formatea una fecha ISO a formato en español legible (ej: "nov 2011" o "23 de marzo de 2015")
 */
export function formatDateSpanish(dateString: string | null): string {
  if (!dateString) return 'Próximamente';
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    if (!year) return dateString;
    const date = new Date(year, (month || 1) - 1, day || 1);
    return date.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'short',
    });
  } catch {
    return dateString;
  }
}

/**
 * Formatea un número con separadores de miles según el locale en español
 */
export function formatNumberSpanish(num: number): string {
  return (num || 0).toLocaleString('es-AR');
}

/**
 * Limpia etiquetas HTML complejas de la descripción de RAWG
 */
export function sanitizeDescription(html?: string): string {
  if (!html) return 'Sin descripción disponible.';
  // Elimina tags pero mantiene saltos de línea legibles
  return html
    .replace(/<p[^>]*>/gi, '')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<br\s*[\/]?>/gi, '\n')
    .replace(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi, '$1\n\n')
    .replace(/<[^>]+>/g, '')
    .trim();
}
