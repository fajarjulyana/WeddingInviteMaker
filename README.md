# Wedding Invitation Generator

Aplikasi web untuk membuat undangan pernikahan digital yang indah dan interaktif.

## Fitur

- ✨ 3 template desain yang menarik
- 📸 Upload hingga 7 foto pernikahan
- 🎵 Background musik dengan file MP3
- ⏰ Hitung mundur otomatis ke hari pernikahan
- 🔗 Share undangan dengan URL unik
- 🎨 Animasi transisi yang smooth menggunakan Framer Motion
- 📱 Responsive design untuk desktop dan mobile

## Tech Stack

- **Frontend:**
  - React dengan TypeScript
  - TailwindCSS & ShadcnUI untuk styling
  - Framer Motion untuk animasi
  - TanStack Query untuk state management
  - Wouter untuk routing

- **Backend:**
  - Express.js
  - PostgreSQL dengan Drizzle ORM
  - Multer untuk file upload

## Development

1. Copy file `.env.example` ke `.env`:
```bash
cp .env.example .env
```

2. Install dependencies:
```bash
npm install
```

3. Setup database:
```bash
npm run db:push
```

4. Jalankan development server:
```bash
npm run dev
```

Untuk panduan instalasi lengkap, silakan lihat [INSTALLATION.md](./INSTALLATION.md)

## Struktur Project

```
├── client/                # Frontend React application
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/       # Page components
│   │   └── lib/         # Utilities and hooks
├── server/               # Backend Express application
│   ├── routes.ts        # API routes
│   └── index.ts         # Server setup
└── db/                  # Database schema and config
```

## License

MIT
