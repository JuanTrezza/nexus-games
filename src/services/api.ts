/**
 * Servicio de conexión con RAWG Video Games API (https://rawg.io/apidocs)
 * Incluye sistema de caché en memoria de 5 minutos, tipado estricto y manejo de errores.
 */

import {
  RAWGGame,
  RAWGGameDetail,
  RAWGGenre,
  RAWGPlatformItem,
  RAWGResponse,
  RAWGScreenshot,
} from '../types';

const BASE_URL = 'https://api.rawg.io/api';
const API_KEY = import.meta.env.VITE_API_KEY || 'c23ae381014c4d348b4efb44cba8f5c0';

// Tiempo de vida de la caché: 5 minutos (en milisegundos)
const CACHE_TTL_MS = 5 * 60 * 1000;

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const memoryCache = new Map<string, CacheEntry<unknown>>();

/**
 * Realiza una llamada GET a RAWG con parámetros, inyecta la API Key y gestiona la caché
 */
async function fetchRAWG<T>(endpoint: string, params: Record<string, string | number | undefined> = {}): Promise<T> {
  const urlParams = new URLSearchParams({ key: API_KEY });

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      urlParams.append(key, String(value));
    }
  });

  const fullUrl = `${BASE_URL}${endpoint}?${urlParams.toString()}`;

  // Verificar si la respuesta se encuentra en caché vigente
  const cached = memoryCache.get(fullUrl);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data as T;
  }

  try {
    const response = await fetch(fullUrl);

    if (!response.ok) {
      throw new Error(`Error en API RAWG: ${response.status} ${response.statusText}`);
    }

    const data: T = await response.json();

    // Guardar en la caché en memoria
    memoryCache.set(fullUrl, {
      data,
      timestamp: Date.now(),
    });

    return data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido al conectar con RAWG API';
    console.error(`[RAWG API Error] Endpoint: ${endpoint}:`, errorMessage);
    throw new Error(errorMessage);
  }
}

/**
 * Obtiene lista paginada de videojuegos con filtros opcionales
 */
export async function getGames(params: {
  page?: number;
  page_size?: number;
  search?: string;
  platforms?: string;
  genres?: string;
  dates?: string;
  metacritic?: string;
  ordering?: string;
}): Promise<RAWGResponse<RAWGGame>> {
  return fetchRAWG<RAWGResponse<RAWGGame>>('/games', params);
}

/**
 * Obtiene la ficha técnica y descripción completa de un juego por su ID
 */
export async function getGameDetails(gameId: number): Promise<RAWGGameDetail> {
  return fetchRAWG<RAWGGameDetail>(`/games/${gameId}`);
}

/**
 * Obtiene las capturas de pantalla de un videojuego en alta resolución
 */
export async function getGameScreenshots(gameId: number): Promise<RAWGResponse<RAWGScreenshot>> {
  return fetchRAWG<RAWGResponse<RAWGScreenshot>>(`/games/${gameId}/screenshots`);
}

/**
 * Obtiene todos los géneros populares con cantidad de títulos e imágenes
 */
export async function getGenres(pageSize = 20): Promise<RAWGResponse<RAWGGenre>> {
  return fetchRAWG<RAWGResponse<RAWGGenre>>('/genres', { page_size: pageSize });
}

/**
 * Obtiene las plataformas y consolas soportadas
 */
export async function getPlatforms(pageSize = 12): Promise<RAWGResponse<RAWGPlatformItem>> {
  return fetchRAWG<RAWGResponse<RAWGPlatformItem>>('/platforms', { page_size: pageSize });
}

/**
 * Búsqueda rápida de juegos para el buscador modal o debounce
 */
export async function searchGamesQuick(query: string, pageSize = 6): Promise<RAWGGame[]> {
  if (!query.trim()) return [];
  const response = await fetchRAWG<RAWGResponse<RAWGGame>>('/games', {
    search: query.trim(),
    page_size: pageSize,
  });
  return response.results || [];
}
