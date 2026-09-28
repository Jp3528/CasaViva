import { Pool } from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import {
  Category,
  Product,
  ProductVariant,
  User,
  Address,
  Coupon,
  Order,
  Review,
  Subscriber,
  EmailLog
} from '../models/types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_COUPONS,
  INITIAL_USERS,
  INITIAL_REVIEWS
} from '../data/seedData';

dotenv.config();

class DataManager {
  private static instance: DataManager;
  public isPostgresConnected: boolean = false;
  public pool: Pool | null = null;

  // In-memory fallback storage with seed data
  public categories: Category[] = [];
  public products: Product[] = [];
  public variants: ProductVariant[] = [];
  public users: User[] = [];
  public addresses: Address[] = [];
  public coupons: Coupon[] = [];
  public orders: Order[] = [];
  public reviews: Review[] = [];
  public subscribers: Subscriber[] = [];
  public emailLogs: EmailLog[] = [];
  public favorites: { id: string; usuario_id: string; producto_id: string; creado_en: string }[] = [];

  private constructor() {
    this.initFallbackData();
    this.initPostgres();
  }

  public static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager();
    }
    return DataManager.instance;
  }

  private initFallbackData(): void {
    this.categories = JSON.parse(JSON.stringify(INITIAL_CATEGORIES));
    this.products = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
    this.coupons = JSON.parse(JSON.stringify(INITIAL_COUPONS));
    this.users = JSON.parse(JSON.stringify(INITIAL_USERS));
    this.reviews = JSON.parse(JSON.stringify(INITIAL_REVIEWS));

    // Extract all variants flat
    this.variants = [];
    this.products.forEach(p => {
      if (p.variantes && p.variantes.length > 0) {
        this.variants.push(...p.variantes);
      }
    });

    // Default addresses
    this.addresses = [
      {
        id: 'addr-1',
        usuario_id: 'usr-cliente-1',
        nombre_destinatario: 'María Claudia López',
        telefono: '+51 912 345 678',
        departamento: 'Lima',
        provincia: 'Lima',
        distrito: 'Miraflores',
        direccion: 'Av. Larco 743, Dpto 402',
        referencia: 'Frente al parque Reducto',
        es_principal: true
      }
    ];

    // Demo Initial Orders
    this.orders = [
      {
        id: 'ord-1001',
        codigo_orden: 'CV-2026-1001',
        usuario_id: 'usr-cliente-1',
        datos_cliente: {
          nombre: 'María Claudia López',
          email: 'maria.lopez@ejemplo.com',
          telefono: '+51 912 345 678',
          tipo_documento: 'DNI',
          numero_documento: '47589632'
        },
        direccion_envio: {
          departamento: 'Lima',
          provincia: 'Lima',
          distrito: 'Miraflores',
          direccion: 'Av. Larco 743, Dpto 402',
          referencia: 'Frente al parque Reducto'
        },
        metodo_envio: 'Envío Estándar Lima',
        costo_envio: 0,
        metodo_pago: 'tarjeta',
        estado_pago: 'simulado',
        subtotal: 380.00,
        descuento: 38.00,
        codigo_cupon: 'CASAVIVA10',
        total: 342.00,
        tipo_comprobante: 'boleta',
        estado_pedido: 'Entregado',
        items: [
          {
            producto_id: 'prod-duvet-lino-lavado',
            variante_id: 'var-duv-marfil',
            sku: 'DUV-LIN-MAR',
            nombre_producto: 'Funda Nórdica Duvet en 100% Puro Lino Lavado',
            nombre_variante: 'Blanco Crudo / Marfil',
            color_nombre: 'Marfil Crudo',
            color_hex: '#FAF6ED',
            precio_unitario: 380.00,
            precio_base: 380.00,
            cantidad: 1,
            subtotal: 380.00,
            imagen: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80',
            stock_disponible: 8
          }
        ],
        creado_en: '2026-08-15T14:30:00.000Z'
      }
    ];

    // Demo Initial Subscribers
    this.subscribers = [
      { id: 'sub-1', email: 'lucia.estilo@decor.pe', origen: 'newsletter_home', creado_en: '2026-08-01T10:00:00.000Z' },
      { id: 'sub-2', email: 'fernando.arq@diseno.com', origen: 'newsletter_home', creado_en: '2026-08-10T12:00:00.000Z' }
    ];
  }

  private async initPostgres(): Promise<void> {
    const hasPgEnv = Boolean(
      process.env.PGHOST ||
      process.env.PGUSER ||
      process.env.PGPASSWORD ||
      process.env.PGDATABASE
    );
    const connectionString = process.env.DATABASE_URL ||
      (hasPgEnv
        ? `postgresql://${process.env.PGUSER || 'postgres'}:${process.env.PGPASSWORD || 'postgres'}@${process.env.PGHOST || 'localhost'}:${process.env.PGPORT || '5432'}/${process.env.PGDATABASE || 'casaviva'}`
        : '');

    if (!connectionString) {
      console.log('ℹ️ DATABASE_URL no configurada. Usando datos demo en memoria.');
      return;
    }

    try {
      this.pool = new Pool({
        connectionString,
        connectionTimeoutMillis: 2000,
      });

      const client = await this.pool.connect();
      this.isPostgresConnected = true;
      console.log('✅ Conexión exitosa a base de datos PostgreSQL.');

      // Run DDL schema
      const schemaPath = path.join(__dirname, 'schema.sql');
      if (fs.existsSync(schemaPath)) {
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        await client.query(schemaSql);
        console.log('✅ Esquema PostgreSQL sincronizado.');
      }

      // Check if products exist in PostgreSQL, if not, seed them
      const res = await client.query('SELECT COUNT(*) FROM productos');
      if (parseInt(res.rows[0].count, 10) === 0) {
        console.log('🌱 Sembrando datos iniciales en PostgreSQL...');
        await this.seedPostgres(client);
        console.log('✅ Datos iniciales sembrados en PostgreSQL.');
      }

      client.release();
    } catch (err: any) {
      this.isPostgresConnected = false;
      console.log('ℹ️ PostgreSQL no disponible de inmediato (' + err.message + '). Usando capa de persistencia estructurada local.');
    }
  }

  private async seedPostgres(client: any): Promise<void> {
    // Insert categories
    for (const cat of INITIAL_CATEGORIES) {
      await client.query(
        `INSERT INTO categorias (id, slug, nombre, descripcion, imagen, orden)
         VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING`,
        [cat.id, cat.slug, cat.nombre, cat.descripcion, cat.imagen, cat.orden]
      );
    }

    // Insert products and variants
    for (const prod of INITIAL_PRODUCTS) {
      await client.query(
        `INSERT INTO productos (
          id, slug, nombre, descripcion, descripcion_corta, categoria_id,
          categoria_nombre, marca, precio_base, precio_anterior, descuento_porcentaje,
          imagen_principal, galeria_imagenes, dimensiones, cuidados, caracteristicas,
          estado, activo, calificacion_promedio, total_resenas, destacado, novedad_bajo_100
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
        ON CONFLICT (id) DO NOTHING`,
        [
          prod.id, prod.slug, prod.nombre, prod.descripcion, prod.descripcion_corta,
          prod.categoria_id, prod.categoria_nombre, prod.marca, prod.precio_base,
          prod.precio_anterior || null, prod.descuento_porcentaje || 0,
          prod.imagen_principal, prod.galeria_imagenes, prod.dimensiones,
          prod.cuidados, prod.caracteristicas, prod.estado, prod.activo,
          prod.calificacion_promedio, prod.total_resenas, prod.destacado || false,
          prod.novedad_bajo_100 || false
        ]
      );

      for (const v of prod.variantes) {
        await client.query(
          `INSERT INTO variantes_producto (
            id, producto_id, sku, nombre_variante, color_nombre, color_hex,
            stock, precio_adicional, imagen_variante
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT (id) DO NOTHING`,
          [
            v.id, v.producto_id, v.sku, v.nombre_variante, v.color_nombre,
            v.color_hex, v.stock, v.precio_adicional || 0, v.imagen_variante || null
          ]
        );
      }
    }

    // Insert coupons
    for (const cup of INITIAL_COUPONS) {
      await client.query(
        `INSERT INTO cupones (id, codigo, tipo_descuento, valor, compra_minima, limite_uso, usos_actuales, activo, descripcion)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (id) DO NOTHING`,
        [cup.id, cup.codigo, cup.tipo_descuento, cup.valor, cup.compra_minima, cup.limite_uso, cup.usos_actuales, cup.activo, cup.descripcion]
      );
    }

    // Insert users
    for (const u of INITIAL_USERS) {
      await client.query(
        `INSERT INTO usuarios (id, nombre, email, password_hash, telefono, rol)
         VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING`,
        [u.id, u.nombre, u.email, u.password_hash, u.telefono || null, u.rol]
      );
    }
  }

  public async query(text: string, params?: any[]): Promise<any> {
    if (this.isPostgresConnected && this.pool) {
      return this.pool.query(text, params);
    }
    return null;
  }
}

export const db = DataManager.getInstance();
