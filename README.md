# CasaViva

![Vista previa de CasaViva](docs/preview.svg)

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

Instala dependencias del servidor y cliente:

```bash
cd server
npm install
cd ../client
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
