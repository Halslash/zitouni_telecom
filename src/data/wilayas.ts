export type DeliveryZone = 'north' | 'highlands' | 'south';

export interface Wilaya {
  code: string;
  name: string;
  zone: DeliveryZone;
}

export interface DeliveryEstimate {
  zoneLabel: string;
  label: string;
  minDays: number;
  maxDays: number;
}

export const DELIVERY_ZONES: Record<
  DeliveryZone,
  { label: string; minDays: number; maxDays: number }
> = {
  north: { label: 'Nord', minDays: 1, maxDays: 2 },
  highlands: { label: 'Hauts plateaux', minDays: 2, maxDays: 3 },
  south: { label: 'Grand Sud', minDays: 3, maxDays: 4 },
};

/**
 * Les 58 wilayas algériennes.
 * La zone est conservée dans la donnée pour brancher plus tard
 * les frais et délais de livraison réels sans modifier l'UI.
 */
export const WILAYAS: Wilaya[] = [
  { code: '01', name: 'Adrar', zone: 'south' },
  { code: '02', name: 'Chlef', zone: 'north' },
  { code: '03', name: 'Laghouat', zone: 'highlands' },
  { code: '04', name: 'Oum El Bouaghi', zone: 'highlands' },
  { code: '05', name: 'Batna', zone: 'highlands' },
  { code: '06', name: 'Béjaïa', zone: 'north' },
  { code: '07', name: 'Biskra', zone: 'highlands' },
  { code: '08', name: 'Béchar', zone: 'south' },
  { code: '09', name: 'Blida', zone: 'north' },
  { code: '10', name: 'Bouira', zone: 'north' },
  { code: '11', name: 'Tamanrasset', zone: 'south' },
  { code: '12', name: 'Tébessa', zone: 'highlands' },
  { code: '13', name: 'Tlemcen', zone: 'north' },
  { code: '14', name: 'Tiaret', zone: 'highlands' },
  { code: '15', name: 'Tizi Ouzou', zone: 'north' },
  { code: '16', name: 'Alger', zone: 'north' },
  { code: '17', name: 'Djelfa', zone: 'highlands' },
  { code: '18', name: 'Jijel', zone: 'north' },
  { code: '19', name: 'Sétif', zone: 'north' },
  { code: '20', name: 'Saïda', zone: 'highlands' },
  { code: '21', name: 'Skikda', zone: 'north' },
  { code: '22', name: 'Sidi Bel Abbès', zone: 'north' },
  { code: '23', name: 'Annaba', zone: 'north' },
  { code: '24', name: 'Guelma', zone: 'north' },
  { code: '25', name: 'Constantine', zone: 'north' },
  { code: '26', name: 'Médéa', zone: 'highlands' },
  { code: '27', name: 'Mostaganem', zone: 'north' },
  { code: '28', name: "M'Sila", zone: 'highlands' },
  { code: '29', name: 'Mascara', zone: 'highlands' },
  { code: '30', name: 'Ouargla', zone: 'south' },
  { code: '31', name: 'Oran', zone: 'north' },
  { code: '32', name: 'El Bayadh', zone: 'highlands' },
  { code: '33', name: 'Illizi', zone: 'south' },
  { code: '34', name: 'Bordj Bou Arréridj', zone: 'north' },
  { code: '35', name: 'Boumerdès', zone: 'north' },
  { code: '36', name: 'El Tarf', zone: 'north' },
  { code: '37', name: 'Tindouf', zone: 'south' },
  { code: '38', name: 'Tissemsilt', zone: 'highlands' },
  { code: '39', name: 'El Oued', zone: 'south' },
  { code: '40', name: 'Khenchela', zone: 'highlands' },
  { code: '41', name: 'Souk Ahras', zone: 'north' },
  { code: '42', name: 'Tipaza', zone: 'north' },
  { code: '43', name: 'Mila', zone: 'north' },
  { code: '44', name: 'Aïn Defla', zone: 'north' },
  { code: '45', name: 'Naâma', zone: 'highlands' },
  { code: '46', name: 'Aïn Témouchent', zone: 'north' },
  { code: '47', name: 'Ghardaïa', zone: 'south' },
  { code: '48', name: 'Relizane', zone: 'north' },
  { code: '49', name: 'Timimoun', zone: 'south' },
  { code: '50', name: 'Bordj Badji Mokhtar', zone: 'south' },
  { code: '51', name: 'Ouled Djellal', zone: 'south' },
  { code: '52', name: 'Béni Abbès', zone: 'south' },
  { code: '53', name: 'In Salah', zone: 'south' },
  { code: '54', name: 'In Guezzam', zone: 'south' },
  { code: '55', name: 'Touggourt', zone: 'south' },
  { code: '56', name: 'Djanet', zone: 'south' },
  { code: '57', name: "El M'Ghair", zone: 'south' },
  { code: '58', name: 'El Meniaa', zone: 'south' },
];

export const DEFAULT_WILAYA: Wilaya =
  WILAYAS.find((wilaya) => wilaya.code === '16') ?? WILAYAS[0];

const WILAYA_BY_CODE = new Map(WILAYAS.map((wilaya) => [wilaya.code, wilaya]));

export function getWilayaByCode(code: string): Wilaya | undefined {
  return WILAYA_BY_CODE.get(code);
}

export function getDeliveryEstimate(wilaya: Wilaya): DeliveryEstimate {
  const zone = DELIVERY_ZONES[wilaya.zone];
  return {
    zoneLabel: zone.label,
    label: `${zone.minDays * 24} à ${zone.maxDays * 24} h`,
    minDays: zone.minDays,
    maxDays: zone.maxDays,
  };
}

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function filterWilayas(query: string): Wilaya[] {
  const term = normalize(query);
  if (!term) return WILAYAS;

  return WILAYAS.filter((wilaya) => {
    return (
      normalize(wilaya.name).includes(term) ||
      wilaya.code.includes(term) ||
      normalize(DELIVERY_ZONES[wilaya.zone].label).includes(term)
    );
  });
}
