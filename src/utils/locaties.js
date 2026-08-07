import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';

// Haalt alle unieke locaties op uit gepubliceerde woningen.
// Wordt gebruikt om de Locatie-dropdown in de zoekbalk te vullen.
export async function getDistinctLocaties() {
  const q = query(collection(db, 'properties'), where('gepubliceerd', '==', true));
  const snapshot = await getDocs(q);

  const locaties = snapshot.docs
    .map((docSnap) => docSnap.data().locatie)
    .filter(Boolean);

  return [...new Set(locaties)].sort((a, b) => a.localeCompare(b, 'nl'));
}
