import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { formatPrijs, formatPeriode } from '../utils/currency';
import './KantoorOverzichtPage.css';

function KantoorOverzichtPage() {
  const [woningen, setWoningen] = useState([]);
  const [laden, setLaden] = useState(true);

  useEffect(() => {
    // onSnapshot i.p.v. eenmalig ophalen: als een collega ergens anders
    // op kantoor tegelijk publiceert, zie je dat direct zonder te verversen.
    const unsubscribe = onSnapshot(collection(db, 'properties'), (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      data.sort((a, b) => (a.naam || '').localeCompare(b.naam || ''));
      setWoningen(data);
      setLaden(false);
    });
    return unsubscribe;
  }, []);

  const toggleVeld = async (id, veld, huidigeWaarde) => {
    // Optimistisch bijwerken zodat de schakelaar direct reageert,
    // onSnapshot bevestigt hierna vanzelf de definitieve staat.
    setWoningen((prev) =>
      prev.map((w) => (w.id === id ? { ...w, [veld]: !huidigeWaarde } : w))
    );
    try {
      await updateDoc(doc(db, 'properties', id), { [veld]: !huidigeWaarde });
    } catch (err) {
      console.error('Kon veld niet bijwerken:', err);
      // Bij een fout de wijziging terugdraaien in de weergave.
      setWoningen((prev) =>
        prev.map((w) => (w.id === id ? { ...w, [veld]: huidigeWaarde } : w))
      );
    }
  };

  return (
    <main className="kantoor-overzicht-page">
      <div className="container">
        <div className="kantoor-header">
          <h1>Kantoor-overzicht</h1>
          <Link to="/beheer/nieuwe-woning" className="btn-primary">
            + Nieuwe woning
          </Link>
        </div>
        <p className="kantoor-intro">
          Hier zie je alle woningen. Zet "Gepubliceerd" aan zodra een concept gecontroleerd is,
          en "Uitgelicht" om een woning op de homepage te tonen.
        </p>

        {laden && <p>Woningen laden...</p>}

        {!laden && woningen.length === 0 && <p>Nog geen woningen gevonden.</p>}

        {!laden && woningen.length > 0 && (
          <div className="kantoor-tabel">
            <div className="kantoor-rij kantoor-rij-header">
              <span>Foto</span>
              <span>Naam</span>
              <span>Locatie</span>
              <span>Prijs</span>
              <span>Gepubliceerd</span>
              <span>Uitgelicht</span>
              <span></span>
            </div>

            {woningen.map((w) => (
              <div key={w.id} className="kantoor-rij">
                <span className="kantoor-foto">
                  {w.images && w.images[0] ? (
                    <img src={w.images[0]} alt={w.naam} />
                  ) : (
                    <span className="kantoor-foto-placeholder" />
                  )}
                </span>
                <span className="kantoor-naam">
                  <Link to={`/property/${w.id}`}>{w.naam || '(geen naam)'}</Link>
                </span>
                <span>{w.locatie || '-'}</span>
                <span>
                  {w.prijs ? `${formatPrijs(w.prijs, w.valuta)} ${formatPeriode(w.periode)}` : '-'}
                </span>
                <span>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={!!w.gepubliceerd}
                      onChange={() => toggleVeld(w.id, 'gepubliceerd', w.gepubliceerd)}
                    />
                    <span className="toggle-slider" />
                  </label>
                </span>
                <span>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={!!w.uitgelicht}
                      onChange={() => toggleVeld(w.id, 'uitgelicht', w.uitgelicht)}
                    />
                    <span className="toggle-slider" />
                  </label>
                </span>
                <span>
                  <Link to={`/beheer/wijzig-woning/${w.id}`} className="kantoor-bewerken">
                    Bewerken
                  </Link>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default KantoorOverzichtPage;
