/**
 * Cidades DDD 047 - Santa Catarina
 * Base de dados de cidades para geração de rotas realistas
 */

export interface City {
  name: string;
  latitude: number;
  longitude: number;
}

export const DDD047_SC_CITIES: City[] = [
  {
    name: "Blumenau",
    latitude: -26.9194,
    longitude: -49.066,
  },
  {
    name: "Brusque",
    latitude: -27.1028,
    longitude: -48.9419,
  },
  {
    name: "Camboriú",
    latitude: -26.9773,
    longitude: -48.6375,
  },
  {
    name: "Ilhota",
    latitude: -27.2747,
    longitude: -48.823,
  },
  {
    name: "Itajaí",
    latitude: -26.9144,
    longitude: -48.6661,
  },
  {
    name: "Luiz Alves",
    latitude: -27.0539,
    longitude: -48.6883,
  },
  {
    name: "Navegantes",
    latitude: -26.8917,
    longitude: -48.6814,
  },
  {
    name: "Penha",
    latitude: -26.7667,
    longitude: -48.6167,
  },
  {
    name: "Piçarras",
    latitude: -26.8,
    longitude: -48.65,
  },
  {
    name: "Tijucas",
    latitude: -27.2406,
    longitude: -48.6356,
  },
];

/**
 * Retorna uma cidade aleatória do DDD 047
 */
export function getRandomCity(): City {
  return DDD047_SC_CITIES[Math.floor(Math.random() * DDD047_SC_CITIES.length)];
}

/**
 * Retorna duas cidades diferentes para rota
 */
export function getRandomRouteFromTo(): { from: City; to: City } {
  const from = getRandomCity();
  let to = getRandomCity();
  
  // Garante que as cidades sejam diferentes
  while (to.name === from.name) {
    to = getRandomCity();
  }
  
  return { from, to };
}

/**
 * Calcula distância aproximada entre dois pontos (Haversine)
 */
export function calculateDistance(city1: City, city2: City): number {
  const R = 6371; // Raio da Terra em km
  const dLat = ((city2.latitude - city1.latitude) * Math.PI) / 180;
  const dLon = ((city2.longitude - city1.longitude) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((city1.latitude * Math.PI) / 180) *
      Math.cos((city2.latitude * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
