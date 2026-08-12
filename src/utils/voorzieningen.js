// Vaste lijst van voorzieningen (booleans in Firestore) gekoppeld aan icoon + label.
// Nieuwe voorziening toevoegen: gewoon een regel toevoegen aan deze lijst.
// De volgorde hier bepaalt ook de volgorde waarin ze getoond worden.
import {
  Waves, Wifi, Fan, Car, Shirt, SprayCan, DoorOpen, ChefHat,
  Sofa, CigaretteOff, TreePine, Tv, Bed, Flame
} from 'lucide-react';

export const VOORZIENINGEN = [
  { key: 'zwembad', icon: Waves, label: 'Zwembad' },
  { key: 'wifi', icon: Wifi, label: 'WiFi' },
  { key: 'airco', icon: Fan, label: 'Airconditioning' },
  { key: 'parkeerplaats', icon: Car, label: 'Parkeergelegenheid' },
  { key: 'wasmachine', icon: Shirt, label: 'Wasmachine' },
  { key: 'schoonmaak', icon: SprayCan, label: 'Schoonmaak inbegrepen' },
  { key: 'balkon', icon: DoorOpen, label: 'Balkon' },
  { key: 'keuken', icon: ChefHat, label: 'Keuken' },
  { key: 'gemeubileerd', icon: Sofa, label: 'Gemeubileerd' },
  { key: 'rookvrij', icon: CigaretteOff, label: 'Rookvrij' },
  { key: 'tuin', icon: TreePine, label: 'Tuin' },
  { key: 'tv', icon: Tv, label: 'TV' },
  { key: 'linnenpakket', icon: Bed, label: 'Linnenpakket' },
  { key: 'bbq', icon: Flame, label: 'BBQ' }
];
