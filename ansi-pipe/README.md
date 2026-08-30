# ANSI Pipe Schedule Calculator

Calculadora de tuberías ANSI basada en normas ASME — consulta cédulas, diámetros, espesores, áreas de flujo y pesos al instante, con cálculos precisos en sistema imperial y métrico. Aplicación web PWA, rápida, offline y sin backend.

> Repositorio: [Alex-Avant/ANSI-Pipe-Schedule-Calculator](https://github.com/Alex-Avant/ANSI-Pipe-Schedule-Calculator)

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38BDF8?style=flat-square&logo=tailwindcss)
![PWA](https://img.shields.io/badge/PWA-ready-5A0FC8?style=flat-square)

## Descripción

Herramienta para ingenieros, técnicos y estudiantes que necesitan consultar la tabla ANSI/ASME de tuberías de acero. Seleccionas **diámetro nominal (pipe size)** y **schedule**, y la app resuelve automáticamente:

- Diámetro exterior (OD) e interior (ID)
- Espesor de pared
- Área de flujo
- Peso por pie/metro
- Volumen interno por pie
- Peso total según **longitud** y **cantidad** de tramos

Los datos provienen de `src/app/pipe_data.json` (~150 KB) y se parsean en `src/lib/pipe-data.ts` — incluye manejo de fracciones como `"4 1/2"` para evitar errores históricos de peso/diámetro.

Interfaz en una sola página (`src/app/page.tsx`) compuesta por selectores y tarjetas de resultados, con estado global persistido.

## Características

- **Selectores inteligentes**: `PipeSelector`, `ScheduleSelector`, `LengthSelector`, `QuantitySelector` — el schedule por defecto privilegia `40` → `STD` → primero disponible.
- **Cálculos completos** (`src/lib/calculations.ts`):
  - `calculateInsideDiameter()` — ID = OD − 2×espesor
  - `calculateFlowArea()` — π·r²
  - `calculateVolumePerFoot()` y `calculateWeightForLength()`
  - Totales por cantidad (`calculateTotalCalculations` con `normalizeQuantity`)
  - Conversión imperial ↔ métrico (pulgadas/mm, lb/ft ↔ kg/m, litros)
- **Historial y favoritos** persistidos con Zustand (`src/store/index.ts`): últimas 20 búsquedas con longitud/cantidad/peso, y marcadores favoritos.
- **Exportación** (`src/lib/export.ts`):
  - PDF con `jspdf` + `jspdf-autotable`
  - Excel con `xlsx`
  - Copiar al portapapeles y compartir como imagen (`html2canvas`)
  - Web Share API con fallback
- **PWA offline**: `public/sw.js` (cache `ansi-pipe-v3`) + `ServiceWorkerRegister` — funciona sin conexión. Si los cambios no aparecen, bump de `CACHE_NAME`.
- **Tema claro/oscuro** con `next-themes`, animaciones con `framer-motion`, gráficos con `recharts`, validación con `zod` + `react-hook-form`.
- **100% cliente**: sin API ni servidor (`../server/` vacío, `src/services/` vacío, vars de `.env.example` no usadas).

## Stack

| Capa | Tecnología |
|------|------------|
| Framework | Next.js 16 (App Router) + React 19 |
| Lenguaje | TypeScript 5 |
| Estilos | Tailwind CSS 4, shadcn-style primitives (`src/components/ui`, `cn()` en `src/lib/utils.ts`) |
| Estado | Zustand 5 con `persist` |
| Export | jspdf, jspdf-autotable, xlsx, html2canvas |
| Animación / UI | framer-motion, lucide-react, sonner, recharts |
| Data fetching | @tanstack/react-query, axios (preparado) |
| Testing | Vitest 3 (environment `node`, shim de `localStorage` en `vitest.setup.ts`) |
| Lint/Format | ESLint (next), Prettier + prettier-plugin-tailwindcss |
| Package manager | **pnpm** (exclusivo) |

## Estructura del proyecto

```
ansi-pipe/
├── public/
│   ├── sw.js                 # Service Worker (precache /)
│   ├── manifest.json
│   └── icons/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Página principal (composición)
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   └── pipe_data.json    # Tabla ANSI completa
│   ├── components/
│   │   ├── layout/           # Header, Footer
│   │   ├── brand/            # Logo
│   │   ├── shared/           # PipeSelector, ScheduleSelector, LengthSelector, QuantitySelector, ResultCard, CalculationPanel, ExportActions, SearchHistory, Favorites
│   │   └── ui/               # Primitivas shadcn
│   ├── lib/
│   │   ├── pipe-data.ts      # Parseo y queries de pipe_data.json
│   │   ├── calculations.ts   # Fórmulas
│   │   ├── export.ts         # PDF / Excel / imagen / clipboard
│   │   ├── validation.ts
│   │   └── utils.ts
│   ├── store/
│   │   └── index.ts          # Zustand store (persist: history, favorites, totalLength, quantity)
│   └── types/
│       └── index.ts
├── next.config.ts            # --webpack forzado, ignoreBuildErrors, headers SW
├── vitest.config.ts
└── vitest.setup.ts
```

## Instalación

Requiere **Node 18+** y **pnpm**.

```bash
# desde ansi-pipe/
pnpm install

# desarrollo (usa --webpack, no Turbopack)
pnpm dev

# build producción
pnpm build
pnpm start
```

Abre http://localhost:3000

> Nota: `next.config.ts` tiene `typescript.ignoreBuildErrors: true`, el build no typecheckea. Ejecuta verificaciones por separado.

## Scripts

```bash
pnpm dev          # next dev --webpack
pnpm build        # next build --webpack
pnpm start        # next start
pnpm lint         # eslint
pnpm exec tsc --noEmit   # typecheck real
pnpm test         # vitest run
pnpm vitest run src/lib/__tests__/calculations.test.ts  # test único
```

## Uso

1. Elige **Pipe Size** (ej. `2`, `4 1/2`, `12`)
2. Elige **Schedule** (ej. `40`, `80`, `STD`, `XS`)
3. Ajusta **Length (ft)** y **Quantity**
4. Revisa **ResultCard** (dimensiones imperial/métrico) y **CalculationPanel** (área, volumen, peso total)
5. Exporta a **PDF / Excel / Imagen** o copia/comparte
6. Usa **Historial** y **Favoritos** para volver rápido (persistidos en `localStorage` bajo clave `pipe-store`)

## PWA

- `public/sw.js` precachea `/` con `CACHE_NAME = ansi-pipe-v3`
- Registrado en cada carga por `ServiceWorkerRegister`
- Si la UI queda cacheada tras un deploy, incrementa `CACHE_NAME` para invalidar

## Testing

- Vitest en modo `node` (sin jsdom — tests de componentes no funcionan aún)
- Shim de `localStorage` en `vitest.setup.ts` para Zustand persist
- Warnings `zustand persist middleware ... storage is currently unavailable` en tests son esperados

## Roadmap sugerido

- [ ] Tests con jsdom + Testing Library
- [ ] Modo tabla comparativa multi-schedule
- [ ] Cálculo de presión / cédula por presión
- [ ] i18n (EN/ES)

## Licencia

MIT — ver `LICENSE` si aplica.

---

Hecho con Next.js, Tailwind y Zustand por [Alex-Avant](https://github.com/Alex-Avant).
