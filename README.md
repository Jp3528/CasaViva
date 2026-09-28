# CasaViva

![Vista previa de CasaViva](docs/preview.png)

Sistema web e-commerce para productos de hogar, construido con React, TypeScript, Vite, Node.js, Express y PostgreSQL. Incluye catalogo, carrito, checkout, cuentas de usuario, cupones, panel administrativo y asistente virtual.

## Funcionalidades

- Catalogo de productos con categorias, variantes y reseñas.
- Carrito, checkout por pasos y generacion de pedido.
- Registro, inicio de sesion y perfil de usuario.
- Panel administrativo para revisar productos, pedidos y ventas.
- Cupones de descuento y suscripcion de clientes.
- API REST en Express con estructura por modelos, repositorios, servicios, controladores y rutas.
- Persistencia PostgreSQL con fallback local para facilitar la demo.

## Stack

- React + TypeScript + Vite
- Node.js + Express + TypeScript
- PostgreSQL
- Vitest
- CSS modular por sistema de diseño

## Ejecutar localmente

Instala dependencias desde la raiz:

```bash
npm install
```

Desde la raiz del proyecto:

```bash
npm run dev
```

Servicios locales:

```txt
Backend:  http://localhost:4000
Frontend: http://localhost:5173
Health:   http://localhost:4000/api/health
```

## Variables de entorno

Copia `server/.env.example` como `server/.env` y ajusta los valores:

```env
DATABASE_URL=postgresql://usuario:clave@localhost:5432/casaviva
PORT=4000
JWT_SECRET=cambia-este-valor-en-tu-entorno-local
```

En produccion `JWT_SECRET` es obligatorio. En desarrollo existe un valor demo para facilitar pruebas locales.

## Despliegue en Vercel

El repositorio incluye `vercel.json` y `api/[...path].ts` para publicar el frontend Vite de `client/dist` junto con la API Express como Vercel Function.

Configuracion recomendada en Vercel:

```txt
Framework Preset: Vite
Build Command: npm --prefix client run build
Output Directory: client/dist
Install Command: npm install
```

Para una demo publica puedes desplegar sin `DATABASE_URL`; la API usa datos demo en memoria. Para persistencia real, agrega en Vercel:

```env
DATABASE_URL=postgresql://...
JWT_SECRET=valor-largo-y-privado
```

No subas `.env` ni claves reales al repositorio.

## Cuentas demo

```txt
Administrador
Email: admin@casaviva.pe
Clave: Admin2026*CV

Cliente
Email: maria.lopez@ejemplo.com
Clave: Cliente123*
```

Cupones disponibles:

```txt
CASAVIVA10
BIENVENIDO15
HOGAR2026
```

## Validacion

```bash
npm run typecheck
npm run test
npm run build
```

## Estructura

```txt
server/   API Express, servicios, repositorios y datos
client/   Aplicacion React, componentes, paginas y contextos
docs/     Recursos visuales para GitHub
```

## Enfoque de portafolio

CasaViva demuestra una aplicacion full-stack con separacion de responsabilidades, UI responsive, flujo de compra, autenticacion, persistencia y pruebas. Para produccion se recomienda conectar PostgreSQL real, rotar `JWT_SECRET`, endurecer roles administrativos y configurar despliegue con variables de entorno privadas.
