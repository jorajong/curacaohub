# Curaçao HUB - React Website

Moderne React-website voor huisverhuur op Curaçao. Een volledige, responsive website met homepage en property detailpagina's.

## Functies

- ✨ Moderne, responsive design
- 🏠 Huizen showcase met zoekfunctionaliteit
- 📱 Mobiel-optimized
- 🎨 Mooie visuele layout gebaseerd op het design
- 🔗 React Router voor pagina-navigatie
- 📝 Property detail pagina met formulier

## Setup

### Vereisten
- Node.js (16+)
- npm of yarn

### Installatie

1. Clone de repository:
```bash
git clone https://github.com/jorajong/curacaohub.git
cd curacaohub
```

2. Installeer dependencies:
```bash
npm install
```

3. Start de development server:
```bash
npm start
```

De website draait op `http://localhost:3000`

### Build voor productie

```bash
npm run build
```

Dit maakt een optimized production build in de `/build` folder.

## Project Structuur

```
src/
├── components/          # Reusable componenten
│   ├── Header.js
│   ├── Hero.js
│   ├── PropertyCard.js
│   ├── FeaturedProperties.js
│   ├── HowItWorks.js
│   ├── Testimonials.js
│   ├── CTASection.js
│   └── Footer.js
├── pages/              # Page componenten
│   ├── HomePage.js
│   └── PropertyDetailPage.js
├── App.js             # Main app component
└── index.js           # Entry point
```

## Design System

### Kleuren
- **Primary**: `#1e3a5f` (Donker blauw)
- **Secondary**: `#d4a574` (Goud)
- **Light BG**: `#f5f2ed` (Licht beige)

### Typography
- Sans-serif voor alle tekst
- Font weights: 400 (regular), 500-700 (bold)

## Deployment

### Vercel Deployment

1. Push naar GitHub:
```bash
git push origin main
```

2. Ga naar [vercel.com](https://vercel.com)
3. Import het GitHub project
4. Vercel bouwt en deployt automatisch

## Toekomstige Features

- [ ] Geavanceerd zoeken en filtering
- [ ] User accounts en wishlist
- [ ] Betalingssysteem
- [ ] Admin dashboard
- [ ] Real database integratie
- [ ] Email notifications

## Licentie

MIT License - zie LICENSE bestand voor details

---

**Website**: [curacaohub.com](https://curacaohub.com)
**Contact**: info@curacaohub.com
