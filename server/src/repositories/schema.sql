-- ==============================================================================
-- SCHEMA POSTGRESQL PARA CASAVIVA E-COMMERCE
-- ==============================================================================

CREATE TABLE IF NOT EXISTS categorias (
    id VARCHAR(50) PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    imagen VARCHAR(500),
    icono VARCHAR(50),
    orden INT DEFAULT 0,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS productos (
    id VARCHAR(50) PRIMARY KEY,
    slug VARCHAR(150) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    descripcion_corta VARCHAR(300) NOT NULL,
    categoria_id VARCHAR(50) REFERENCES categorias(id) ON DELETE SET NULL,
    categoria_nombre VARCHAR(150),
    marca VARCHAR(100) NOT NULL,
    precio_base NUMERIC(10, 2) NOT NULL,
    precio_anterior NUMERIC(10, 2),
    descuento_porcentaje INT DEFAULT 0,
    imagen_principal VARCHAR(500) NOT NULL,
    galeria_imagenes TEXT[] DEFAULT '{}',
    dimensiones VARCHAR(255),
    cuidados TEXT,
    caracteristicas TEXT[] DEFAULT '{}',
    estado VARCHAR(50) DEFAULT 'Nuevo',
    activo BOOLEAN DEFAULT TRUE,
    calificacion_promedio NUMERIC(3, 2) DEFAULT 5.0,
    total_resenas INT DEFAULT 0,
    destacado BOOLEAN DEFAULT FALSE,
    novedad_bajo_100 BOOLEAN DEFAULT FALSE,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS variantes_producto (
    id VARCHAR(50) PRIMARY KEY,
    producto_id VARCHAR(50) NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    sku VARCHAR(100) UNIQUE NOT NULL,
    nombre_variante VARCHAR(150) NOT NULL,
    color_nombre VARCHAR(100) NOT NULL,
    color_hex VARCHAR(20) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    precio_adicional NUMERIC(10, 2) DEFAULT 0.00,
    imagen_variante VARCHAR(500),
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS usuarios (
    id VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    telefono VARCHAR(50),
    rol VARCHAR(20) DEFAULT 'cliente',
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS direcciones (
    id VARCHAR(50) PRIMARY KEY,
    usuario_id VARCHAR(50) NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    nombre_destinatario VARCHAR(150) NOT NULL,
    telefono VARCHAR(50) NOT NULL,
    departamento VARCHAR(100) NOT NULL,
    provincia VARCHAR(100) NOT NULL,
    distrito VARCHAR(100) NOT NULL,
    direccion TEXT NOT NULL,
    referencia TEXT,
    es_principal BOOLEAN DEFAULT FALSE,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cupones (
    id VARCHAR(50) PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    tipo_descuento VARCHAR(20) NOT NULL,
    valor NUMERIC(10, 2) NOT NULL,
    compra_minima NUMERIC(10, 2) DEFAULT 0,
    limite_uso INT DEFAULT 100,
    usos_actuales INT DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE,
    descripcion VARCHAR(255),
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pedidos (
    id VARCHAR(50) PRIMARY KEY,
    codigo_orden VARCHAR(50) UNIQUE NOT NULL,
    usuario_id VARCHAR(50) REFERENCES usuarios(id) ON DELETE SET NULL,
    datos_cliente JSONB NOT NULL,
    direccion_envio JSONB NOT NULL,
    metodo_envio VARCHAR(100) NOT NULL,
    costo_envio NUMERIC(10, 2) NOT NULL,
    metodo_pago VARCHAR(50) NOT NULL,
    estado_pago VARCHAR(50) DEFAULT 'simulado',
    subtotal NUMERIC(10, 2) NOT NULL,
    descuento NUMERIC(10, 2) DEFAULT 0.00,
    codigo_cupon VARCHAR(50),
    total NUMERIC(10, 2) NOT NULL,
    tipo_comprobante VARCHAR(20) DEFAULT 'boleta',
    datos_facturacion JSONB,
    estado_pedido VARCHAR(50) DEFAULT 'Pendiente',
    items JSONB NOT NULL,
    notas TEXT,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS resenas (
    id VARCHAR(50) PRIMARY KEY,
    producto_id VARCHAR(50) NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    usuario_nombre VARCHAR(150) NOT NULL,
    calificacion INT NOT NULL CHECK (calificacion >= 1 AND calificacion <= 5),
    titulo VARCHAR(200),
    comentario TEXT NOT NULL,
    verificada BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS favoritos (
    id VARCHAR(50) PRIMARY KEY,
    usuario_id VARCHAR(50) NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    producto_id VARCHAR(50) NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(usuario_id, producto_id)
);

CREATE TABLE IF NOT EXISTS suscriptores (
    id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(150) UNIQUE NOT NULL,
    origen VARCHAR(100) DEFAULT 'newsletter_home',
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS logs_correos (
    id VARCHAR(50) PRIMARY KEY,
    destinatario VARCHAR(150) NOT NULL,
    asunto VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    cuerpo_resumen TEXT NOT NULL,
    enviado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimización de consultas
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_productos_precio ON productos(precio_base);
CREATE INDEX IF NOT EXISTS idx_productos_estado ON productos(estado);
CREATE INDEX IF NOT EXISTS idx_variantes_producto ON variantes_producto(producto_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_usuario ON pedidos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_codigo ON pedidos(codigo_orden);
CREATE INDEX IF NOT EXISTS idx_resenas_producto ON resenas(producto_id);
