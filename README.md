# CasaViva - Sistema Web E-commerce de Hogar y Diseño 🌿

**CasaViva** es una plataforma de comercio electrónico moderna, cálida, ordenada y confiable para la venta de productos del hogar: sala, dormitorio, cocina, baño, decoración, organización, iluminación y accesorios.

Precios expresados en **Soles peruanos (S/.)**, con un catálogo rico en piezas de diseño contemporáneo y amplia variedad de novedades accesibles por debajo de S/ 100.

---

## 🏛️ Arquitectura del Sistema (Adaptación MVC)

El sistema implementa una arquitectura desacoplada y limpia:

```
casaviva/
├── server/                         # Backend MVC en Node/Express + TypeScript
│   ├── src/
│   │   ├── models/                 # Modelos de dominio y tipado TypeScript
│   │   ├── repositories/           # Capa de persistencia (PostgreSQL + DataManager dual)
│   │   ├── services/               # Lógica de negocio (precios, stock, cupones, pedidos)
│   │   ├── controllers/            # Controladores de endpoints REST
│   │   ├── routes/                 # Enrutadores Express (/api/...)
│   │   └── data/                   # Semillas de datos iniciales en Soles
│   └── tsconfig.json
├── client/                         # Frontend en React + TypeScript + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── hero/               # Sala interactiva con puntos discretos y cambio de color
│   │   │   ├── product/            # Grid, Cards, Filtros, Galería, Variantes, Reseñas
│   │   │   ├── cart/               # Drawer lateral y página de carrito
│   │   │   ├── checkout/           # Checkout por pasos, comprobantes Boleta/Factura
│   │   │   ├── account/            # Perfil, direcciones, pedidos, lista de deseos
│   │   │   ├── admin/              # Panel administrativo con productos agrupados
│   │   │   └── chatbot/            # Asistente virtual flotante de compras
│   │   ├── context/                # CartContext, AuthContext, WishlistContext, ToastContext
│   │   ├── pages/                  # Vistas principales de la aplicación
│   │   ├── services/               # Cliente API HTTP
│   │   └── styles/                 # Sistema de diseño editorial cálido
│   └── vite.config.ts
└── start-dev.js                    # Inicializador concurrente
```

---

## 🎨 Identidad Visual y Estética

- **Paleta de Colores**:
  - *Blanco cálido / Marfil*: `#FAF8F5`
  - *Beige / Arena*: `#F4EFE6`, `#EAE4D9`
  - *Gris Carbón*: `#20201E`
  - *Verde Oliva / Salvia*: `#53634B`
  - *Terracota suave (ofertas)*: `#C45E3D`
- **Tipografía**: Títulos con tipografía editorial refinada (`Cormorant Garamond` / `Playfair Display`) y cuerpo con sans-serif legible (`Plus Jakarta Sans`).

---

## 🚀 Instalación y Puesta en Marcha

### 1. Instalar dependencias

En la carpeta raíz del proyecto (`casaviva`):

```bash
# Instalar dependencias del servidor
cd server
npm install

# Instalar dependencias del cliente
cd ../client
npm install
```

### 2. Ejecutar en desarrollo

Desde la raíz (`casaviva`):

```bash
npm run dev
```

Esto levantará automáticamente:
- **Backend API**: `http://localhost:4000` (Healthcheck: `http://localhost:4000/api/health`)
- **Frontend React**: `http://localhost:5173`

---

## 🗄️ Base de Datos PostgreSQL

CasaViva incluye el esquema SQL relacional completo en `server/src/repositories/schema.sql` (tablas `categorias`, `productos`, `variantes_producto`, `usuarios`, `direcciones`, `cupones`, `pedidos`, `resenas`, `suscriptores`, `logs_correos`).

Para conectar con una base de datos PostgreSQL local o remota, configura tu archivo `server/.env`:

```env
DATABASE_URL=postgresql://usuario:clave@localhost:5432/casaviva
PORT=4000
JWT_SECRET=cambia-este-valor-en-tu-entorno-local
```

> **Nota de Resiliencia**: Si PostgreSQL no está levantado en tu máquina local, el sistema activa automáticamente su **capa de persistencia estructurada local**, permitiendo que toda la tienda, el checkout, el catálogo, las cuentas y el panel de administración funcionen al 100% de inmediato.

---

## 🔑 Cuentas Demo para Pruebas

- **Administrador**:
  - Email: `admin@casaviva.pe`
  - Contraseña: `Admin2026*CV`
- **Cliente**:
  - Email: `maria.lopez@ejemplo.com`
  - Contraseña: `Cliente123*`

### 🎟️ Cupones de Descuento Activos
- `CASAVIVA10`: 10% de descuento (compras desde S/ 50).
- `BIENVENIDO15`: 15% de descuento (primera compra desde S/ 100).
- `HOGAR2026`: S/ 30 de descuento directo (compras desde S/ 200).

---

## 🧪 Validaciones y Pruebas

Para ejecutar las pruebas unitarias y de integración con Vitest:

```bash
cd client
npm run test
```

Para verificar tipos TypeScript:

```bash
# Servidor
cd server
npm run typecheck

# Cliente
cd client
npm run typecheck
```
