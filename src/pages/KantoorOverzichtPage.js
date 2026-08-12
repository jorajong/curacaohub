import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { formatPrijs, formatPeriode } from '../utils/currency';
import './KantoorOverzichtPage.css';

function KantoorOverzichtPage() {
  const [woningen, setWoningen] = useState([]);
  const [verhuurders, setVerhuurders] = useState({});
  const [laden, setLaden] = useState(true);
  const [uitgeklapt, setUitgeklapt] = useState(null);

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

  useEffect(() => {
    // Alle verhuurders (ook niet-actieve) in een lookup-object per ID, zodat
    // de details per woning meteen te tonen zijn zonder losse ophaal-actie.
    const unsubscribe = onSnapshot(collection(db, 'verhuurders'), (snapshot) => {
      const lookup = {};
      snapshot.docs.forEach((d) => {
        lookup[d.id] = { id: d.id, ...d.data() };
      });
      setVerhuurders(lookup);
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

  const toggleDetails = (id) => {
    setUitgeklapt((prev) => (prev === id ? null : id));
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
              <span></span>
            </div>

            {woningen.map((w) => {
              const verhuurder = verhuurders[w.verhuurderId];
              return (
                <React.Fragment key={w.id}>
                  <div className="kantoor-rij">
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
                    <span>
                      <button type="button" className="kantoor-details-btn" onClick={() => toggleDetails(w.id)}>
                        {uitgeklapt === w.id ? 'Verberg' : 'Details'}
                      </button>
                    </span>
                  </div>

                  {uitgeklapt === w.id && (
                    <div className="kantoor-details-paneel">
                      <div className="kantoor-details-blok">
                        <h3>Verhuurder</h3>
                        {verhuurder ? (
                          <>
                            <p><strong>{verhuurder.verhuurderNaam}</strong></p>
                            <p>{verhuurder.verhuurderTelefoon} · {verhuurder.verhuurderEmail}</p>
                            {verhuurder.verhuurderIdFoto && (
                              <a href={verhuurder.verhuurderIdFoto} target="_blank" rel="noopener noreferrer">
                                ID verhuurder bekijken
                              </a>
                            )}
                          </>
                        ) : (
                          <p>Geen verhuurder gekoppeld.</p>
                        )}
                      </div>

                      <div className="kantoor-details-blok">
                        <h3>Beheerder</h3>
                        {verhuurder ? (
                          <>
                            <p><strong>{verhuurder.beheerderNaam}</strong></p>
                            <p>{verhuurder.beheerderTelefoon} · {verhuurder.beheerderEmail}</p>
                            {verhuurder.beheerderIdFoto && (
                              <a href={verhuurder.beheerderIdFoto} target="_blank" rel="noopener noreferrer">
                                ID beheerder bekijken
                              </a>
                            )}
                          </>
                        ) : (
                          <p>-</p>
                        )}
                      </div>

                      <div className="kantoor-details-blok">
                        <h3>Documenten</h3>
                        {w.huisregelsUrl && (
                          <a href={w.huisregelsUrl} target="_blank" rel="noopener noreferrer">Huisregels bekijken</a>
                        )}
                        {w.voorbeeldContractUrl && (
                          <a href={w.voorbeeldContractUrl} target="_blank" rel="noopener noreferrer">Voorbeeld contract bekijken</a>
                        )}
                        {!w.huisregelsUrl && !w.voorbeeldContractUrl && <p>Geen documenten geüpload.</p>}
                      </div>

                      {w.opmerkingen && (
                        <div className="kantoor-details-blok">
                          <h3>Opmerkingen</h3>
                          <p>{w.opmerkingen}</p>
                        </div>
                      )}
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default KantoorOverzichtPage;
