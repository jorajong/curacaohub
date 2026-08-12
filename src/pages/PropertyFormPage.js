import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { collection, doc, setDoc, updateDoc, getDoc, onSnapshot, query, where, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { VOORZIENINGEN } from '../utils/voorzieningen';
import './PropertyFormPage.css';

const MAX_FOTOS = 4;

function PropertyFormPage() {
  const { id } = useParams();
  const bewerkModus = Boolean(id);
  const navigate = useNavigate();

  const [verhuurders, setVerhuurders] = useState([]);
  const [verhuurderId, setVerhuurderId] = useState('');

  useEffect(() => {
    // Alleen actieve verhuurders zijn kiesbaar. Bij bewerken kan de gekoppelde
    // verhuurder inmiddels niet-actief zijn — die wordt dan los toegevoegd
    // zodat de keuze niet stilletjes verdwijnt.
    const q = query(collection(db, 'verhuurders'), where('actief', '==', true));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      data.sort((a, b) => (a.verhuurderNaam || '').localeCompare(b.verhuurderNaam || ''));
      setVerhuurders(data);
    });
    return unsubscribe;
  }, []);

  const [naam, setNaam] = useState('');
  const [locatie, setLocatie] = useState('');
  const [beschrijving, setBeschrijving] = useState('');
  const [oppervlakte, setOppervlakte] = useState('');
  const [slaapkamers, setSlaapkamers] = useState('');
  const [gasten, setGasten] = useState('');
  const [prijs, setPrijs] = useState('');
  const [valuta, setValuta] = useState('EUR');
  const [periode, setPeriode] = useState('maand');
  const [uitgelicht, setUitgelicht] = useState(false);

  const [tags, setTags] = useState([]);
  const [tagInvoer, setTagInvoer] = useState('');

  const [voorzieningen, setVoorzieningen] = useState({});

  // Elk item is { type: 'bestaand', url } voor foto's die al in Storage staan,
  // of { type: 'nieuw', bestand, previewUrl } voor net geselecteerde bestanden.
  // Zo blijft de volgorde (incl. hoofdfoto) kloppen, ongeacht herkomst.
  const [fotoItems, setFotoItems] = useState([]);

  // Bewaart velden die dit formulier niet zelf beheert, zodat ze bij het
  // opslaan van een bewerking niet per ongeluk worden overschreven.
  const [gepubliceerd, setGepubliceerd] = useState(false);
  const [aangemaaktOp, setAangemaaktOp] = useState(null);

  const [bezigMetLaden, setBezigMetLaden] = useState(bewerkModus);
  const [bezigMetOpslaan, setBezigMetOpslaan] = useState(false);
  const [foutmelding, setFoutmelding] = useState('');
  const [gelukt, setGelukt] = useState(false);

  useEffect(() => {
    if (!bewerkModus) return;

    const woningOphalen = async () => {
      setBezigMetLaden(true);
      try {
        const snap = await getDoc(doc(db, 'properties', id));
        if (!snap.exists()) {
          setFoutmelding('Deze woning kon niet worden gevonden.');
          return;
        }
        const data = snap.data();

        setVerhuurderId(data.verhuurderId || '');
        setNaam(data.naam || '');
        setLocatie(data.locatie || '');
        setBeschrijving(data.beschrijving || '');
        setOppervlakte(data.oppervlakte ?? '');
        setSlaapkamers(data.slaapkamers ?? '');
        setGasten(data.gasten ?? '');
        setPrijs(data.prijs ?? '');
        setValuta(data.valuta || 'EUR');
        setPeriode(data.periode || 'maand');
        setUitgelicht(!!data.uitgelicht);
        setTags(data.tag || []);

        const bestaandeVoorzieningen = {};
        VOORZIENINGEN.forEach((v) => {
          bestaandeVoorzieningen[v.key] = !!data[v.key];
        });
        setVoorzieningen(bestaandeVoorzieningen);

        setFotoItems((data.images || []).map((url) => ({ type: 'bestaand', url })));

        setGepubliceerd(!!data.gepubliceerd);
        setAangemaaktOp(data.aangemaaktOp || null);
      } catch (error) {
        console.error(error);
        setFoutmelding('Woning laden is niet gelukt.');
      } finally {
        setBezigMetLaden(false);
      }
    };

    woningOphalen();
  }, [id, bewerkModus]);

  const toggleVoorziening = (key) => {
    setVoorzieningen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const tagToevoegen = () => {
    if (tagInvoer.trim()) {
      setTags((prev) => [...prev, tagInvoer.trim()]);
      setTagInvoer('');
    }
  };

  const handleTagToevoegen = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      tagToevoegen();
    }
  };

  const verwijderTag = (index) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFotoSelectie = (e) => {
    const geselecteerd = Array.from(e.target.files).map((bestand) => ({
      type: 'nieuw',
      bestand,
      previewUrl: URL.createObjectURL(bestand),
    }));
    setFotoItems((prev) => [...prev, ...geselecteerd].slice(0, MAX_FOTOS));
    e.target.value = '';
  };

  const verwijderFoto = (index) => {
    setFotoItems((prev) => {
      const item = prev[index];
      if (item?.type === 'nieuw') {
        URL.revokeObjectURL(item.previewUrl);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const resetFormulier = () => {
    setVerhuurderId('');
    setNaam('');
    setLocatie('');
    setBeschrijving('');
    setOppervlakte('');
    setSlaapkamers('');
    setGasten('');
    setPrijs('');
    setValuta('EUR');
    setPeriode('maand');
    setUitgelicht(false);
    setTags([]);
    setTagInvoer('');
    setVoorzieningen({});
    setFotoItems([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFoutmelding('');
    setGelukt(false);

    if (!verhuurderId || !naam.trim() || !locatie.trim() || !prijs || !beschrijving.trim()) {
      setFoutmelding('Vul minimaal verhuurder, naam, locatie, prijs en beschrijving in.');
      return;
    }

    setBezigMetOpslaan(true);

    // Vangnet: als er nog een tag in het invoerveld staat die niet
    // expliciet is toegevoegd (bijv. geen Enter/knop gebruikt), toch meenemen.
    const alleTags = tagInvoer.trim() ? [...tags, tagInvoer.trim()] : tags;

    try {
      const docRef = bewerkModus ? doc(db, 'properties', id) : doc(collection(db, 'properties'));

      // Bestaande foto's blijven gewoon hun URL houden; alleen nieuw
      // geselecteerde bestanden worden nu geüpload.
      const imageUrls = [];
      for (let i = 0; i < fotoItems.length; i++) {
        const item = fotoItems[i];
        if (item.type === 'bestaand') {
          imageUrls.push(item.url);
        } else {
          const fotoRef = ref(storage, `properties/${docRef.id}/foto-${i + 1}`);
          await uploadBytes(fotoRef, item.bestand);
          const url = await getDownloadURL(fotoRef);
          imageUrls.push(url);
        }
      }

      const woningData = {
        verhuurderId,
        naam: naam.trim(),
        locatie: locatie.trim(),
        beschrijving: beschrijving.trim(),
        images: imageUrls,
        oppervlakte: Number(oppervlakte) || 0,
        slaapkamers: Number(slaapkamers) || 0,
        gasten: Number(gasten) || 0,
        prijs: Number(prijs) || 0,
        valuta,
        periode,
        tag: alleTags,
        uitgelicht,
        ...voorzieningen,
      };

      if (bewerkModus) {
        // Gepubliceerd-status blijft ongewijzigd — dat wordt alleen via
        // het kantoor-overzicht aan- of uitgezet, niet via dit formulier.
        await updateDoc(docRef, {
          ...woningData,
          gepubliceerd,
          bijgewerktOp: serverTimestamp(),
        });
        setGelukt(true);
      } else {
        await setDoc(docRef, {
          ...woningData,
          // Concept bij opslaan vanuit dit formulier — pas op kantoor
          // wordt dit veld op true gezet en verschijnt de woning live.
          gepubliceerd: false,
          aangemaaktOp: serverTimestamp(),
        });
        setGelukt(true);
        resetFormulier();
      }
    } catch (error) {
      console.error(error);
      setFoutmelding('Opslaan is niet gelukt. Probeer het opnieuw.');
    } finally {
      setBezigMetOpslaan(false);
    }
  };

  if (bezigMetLaden) {
    return (
      <main className="property-form-page">
        <div className="container">
          <p>Woning laden...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="property-form-page">
      <div className="container">
        <div className="form-header">
          <h1>{bewerkModus ? 'Woning bewerken' : 'Nieuwe woning toevoegen'}</h1>
          <Link to="/beheer/kantoor-overzicht">Naar kantoor-overzicht →</Link>
        </div>
        <p className="form-intro">
          {bewerkModus
            ? 'Wijzigingen worden direct opgeslagen op de bestaande woning. De publicatiestatus zelf wijzig je in het kantoor-overzicht.'
            : 'Dit formulier slaat de woning op als concept. De woning verschijnt pas op de site nadat deze op kantoor is gecontroleerd en gepubliceerd.'}
        </p>

        {gelukt && (
          <div className="form-success">
            {bewerkModus
              ? 'Wijzigingen opgeslagen.'
              : 'Woning opgeslagen als concept. Op kantoor wordt deze binnenkort gecontroleerd en gepubliceerd.'}
          </div>
        )}

        <form onSubmit={handleSubmit} className="property-form">
          <section className="form-section">
            <h2>Verhuurder</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Verhuurder *</label>
                <select value={verhuurderId} onChange={(e) => setVerhuurderId(e.target.value)} required>
                  <option value="">Kies een verhuurder...</option>
                  {verhuurders.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.verhuurderNaam}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <Link to="/beheer/verhuurders" target="_blank" className="form-hint-link">
              + Nieuwe verhuurder registreren (opent in nieuw tabblad)
            </Link>
          </section>

          <section className="form-section">
            <h2>Algemene informatie</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Naam woning *</label>
                <input type="text" value={naam} onChange={(e) => setNaam(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Locatie *</label>
                <input
                  type="text"
                  value={locatie}
                  onChange={(e) => setLocatie(e.target.value)}
                  placeholder="bijv. Jan Thiel"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Beschrijving *</label>
              <textarea
                value={beschrijving}
                onChange={(e) => setBeschrijving(e.target.value)}
                rows="4"
                placeholder="Korte omschrijving die op de detailpagina komt te staan..."
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Oppervlakte (m²)</label>
                <input type="number" min="0" value={oppervlakte} onChange={(e) => setOppervlakte(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Slaapkamers</label>
                <input type="number" min="0" value={slaapkamers} onChange={(e) => setSlaapkamers(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Aantal gasten</label>
                <input type="number" min="0" value={gasten} onChange={(e) => setGasten(e.target.value)} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Prijs *</label>
                <input type="number" min="0" value={prijs} onChange={(e) => setPrijs(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Valuta</label>
                <select value={valuta} onChange={(e) => setValuta(e.target.value)}>
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                  <option value="XCG">XCG</option>
                </select>
              </div>
              <div className="form-group">
                <label>Periode</label>
                <select value={periode} onChange={(e) => setPeriode(e.target.value)}>
                  <option value="maand">Per maand</option>
                  <option value="week">Per week</option>
                </select>
              </div>
            </div>

            <label className="checkbox-line">
              <input type="checkbox" checked={uitgelicht} onChange={(e) => setUitgelicht(e.target.checked)} />
              Uitgelicht op homepage
            </label>
          </section>

          <section className="form-section">
            <h2>Tags</h2>
            <div className="tag-input-row">
              <input
                type="text"
                value={tagInvoer}
                onChange={(e) => setTagInvoer(e.target.value)}
                onKeyDown={handleTagToevoegen}
                placeholder="Typ een tag (bijv. Nieuw)"
              />
              <button type="button" className="btn-secondary" onClick={tagToevoegen}>
                Toevoegen
              </button>
            </div>
            {tags.length > 0 && (
              <div className="tag-list">
                {tags.map((tag, index) => (
                  <span key={index} className="tag-chip">
                    {tag}
                    <button type="button" onClick={() => verwijderTag(index)} aria-label="Tag verwijderen">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </section>

          <section className="form-section">
            <h2>Voorzieningen</h2>
            <div className="voorzieningen-grid">
              {VOORZIENINGEN.map((v) => (
                <label key={v.key} className="voorziening-item">
                  <input
                    type="checkbox"
                    checked={!!voorzieningen[v.key]}
                    onChange={() => toggleVoorziening(v.key)}
                  />
                  <v.icon className="voorziening-icon" size={18} strokeWidth={1.75} />
                  <span>{v.label}</span>
                </label>
              ))}
            </div>
          </section>

          <section className="form-section">
            <h2>Foto's (max {MAX_FOTOS})</h2>
            <p className="form-hint">De eerste foto wordt de hoofdfoto.</p>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFotoSelectie}
              disabled={fotoItems.length >= MAX_FOTOS}
            />
            {fotoItems.length > 0 && (
              <div className="foto-previews">
                {fotoItems.map((item, index) => (
                  <div key={index} className="foto-preview">
                    <img src={item.type === 'bestaand' ? item.url : item.previewUrl} alt={`Foto ${index + 1}`} />
                    {index === 0 && <span className="hoofdfoto-badge">Hoofdfoto</span>}
                    <button type="button" onClick={() => verwijderFoto(index)} aria-label="Foto verwijderen">
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {foutmelding && <p className="form-error">{foutmelding}</p>}

          <button type="submit" className="btn-primary btn-full" disabled={bezigMetOpslaan}>
            {bezigMetOpslaan
              ? 'BEZIG MET OPSLAAN...'
              : bewerkModus
              ? 'WIJZIGINGEN OPSLAAN'
              : 'OPSLAAN ALS CONCEPT'}
          </button>
        </form>
      </div>
    </main>
  );
}

export default PropertyFormPage;
