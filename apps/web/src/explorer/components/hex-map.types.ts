import type { HexStatus } from './hex-map.constants';

/**
 * Shape of a single hex in the Phase 1 manifest.
 *
 * Cross-chain identifier: `nodeNumber` (1-200) is the public/marketing
 * identifier. `h3Index` is the cross-chain primary key used in both the
 * Cardano CIP-0068 asset_name and the Base ERC-721 tokenId mapping.
 */
export interface Phase1Hex {
  nodeNumber: number;
  h3Index: string;
  h3Resolution: number;
  status: HexStatus;
  operator: string | null;
  region: string;
  country: string;
  administrativeArea: string | null;
  locality: string | null;
  postalCode: string | null;
  centroidLat: number;
  centroidLng: number;
  zoneClassification:
    | 'urban'
    | 'dense-suburban'
    | 'rural'
    | 'frontier'
    | 'strategic'
    | null;
  geographicMultiplier: number | null; // 0.5, 1.0, 1.5, 2.0, 3.0
  dataDemandScore: number | null; // 0-100
  listingReferenceUsd: number;
  genesisReserveUsd: number;
  notes?: string;
}

export interface Phase1Manifest {
  schemaVersion: string;
  manifestName: string;
  h3Resolution: number;
  totalCells: number;
  soldOrReserved: number;
  externalAvailable: number;
  lastUpdated: string;
  wavesPolicy: string;
  regions: string[];
  statusVocabulary: Record<HexStatus, string>;
  hexes: Phase1Hex[];
}

export interface LandCellSet {
  schemaVersion: string;
  resolution: number;
  generatedAt: string;
  count: number;
  cells: string[]; // H3 indexes
}

export interface HexClickEvent {
  hex: Phase1Hex;
  screenX: number;
  screenY: number;
}
