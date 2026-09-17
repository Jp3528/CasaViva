import { Category, Product, Coupon, User, Review } from '../models/types';
import bcrypt from 'bcryptjs';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-sala',
    slug: 'sala',
    nombre: 'Sala y Estar',
    descripcion: 'Mobiliario modular, sofás de lino y mesas de centro para reuniones acogedoras.',
    imagen: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    orden: 1
  },
  {
    id: 'cat-dormitorio',
    slug: 'dormitorio',
    nombre: 'Dormitorio',
    descripcion: 'Ropa de cama en algodón orgánico, respaldos tapizados y mesas de noche serenas.',
    imagen: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80',
    orden: 2
  },
  {
    id: 'cat-cocina',
    slug: 'cocina',
    nombre: 'Cocina y Comedor',
    descripcion: 'Vajilla artesanal de gres, mantelería de lino y tablas de madera maciza.',
    imagen: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
    orden: 3
  },
  {
    id: 'cat-bano',
    slug: 'bano',
    nombre: 'Baño',
    descripcion: 'Toallas de felpa premium, dispensadores de cerámica y accesorios spa.',
    imagen: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    orden: 4
  },
  {
    id: 'cat-decoracion',
    slug: 'decoracion',
    nombre: 'Decoración',
    descripcion: 'Floreros escultóricos, espejos orgánicos, cuadros botánicos y velas aromáticas.',
    imagen: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
    orden: 5
  },
  {
    id: 'cat-organizacion',
    slug: 'organizacion',
    nombre: 'Organización',
    descripcion: 'Cestas de fibra natural, cajas modulares y percheros para mantener el orden.',
    imagen: 'https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?auto=format&fit=crop&w=800&q=80',
    orden: 6
  },
  {
    id: 'cat-iluminacion',
    slug: 'iluminacion',
    nombre: 'Iluminación',
    descripcion: 'Lámparas colgantes de mimbre, lámparas de mesa cerámicas y apliques cálidos.',
    imagen: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    orden: 7
  },
  {
    id: 'cat-accesorios',
    slug: 'accesorios',
    nombre: 'Accesorios y Textiles',
    descripcion: 'Cojines texturados, mantas tipo throw y alfombras tejidas a mano.',
    imagen: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    orden: 8
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  // SALA
  {
    id: 'prod-sofa-modular-toscana',
    slug: 'sofa-modular-toscana-lino',
    nombre: 'Sofá Modular Toscana 3 Cuerpos en Lino',
    descripcion: 'Sofá modular de líneas puras tapizado en lino natural tratado antimanchas. Su estructura de madera de roble sostenible y relleno de espuma de alta resiliencia brindan una comodidad insuperable y una estética contemporánea y relajante.',
    descripcion_corta: 'Elegancia contemporánea en lino natural con estructura de roble.',
    categoria_id: 'cat-sala',
    categoria_nombre: 'Sala y Estar',
    marca: 'CasaViva Studio',
    precio_base: 1890.00,
    precio_anterior: 2290.00,
    descuento_porcentaje: 17,
    imagen_principal: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    galeria_imagenes: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80'
    ],
    dimensiones: '220 cm (ancho) x 95 cm (profundidad) x 82 cm (alto)',
    cuidados: 'Aspirar periódicamente con cepillo suave. Limpiar manchas con paño húmedo y jabón neutro.',
    caracteristicas: [
      'Tapizado en 100% lino de alto gramaje',
      'Estructura de madera maciza de roble',
      'Cojines desenfundables con cremallera oculta',
      'Patas con protectores de fieltro para pisos delicados'
    ],
    estado: 'Selección CasaViva',
    activo: true,
    calificacion_promedio: 4.9,
    total_resenas: 28,
    destacado: true,
    novedad_bajo_100: false,
    variantes: [
      {
        id: 'var-sofa-marfil',
        producto_id: 'prod-sofa-modular-toscana',
        sku: 'SOF-TOS-MAR',
        nombre_variante: 'Marfil Cálido',
        color_nombre: 'Marfil Cálido',
        color_hex: '#F5F2EB',
        stock: 6,
        precio_adicional: 0,
        imagen_variante: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'var-sofa-salvia',
        producto_id: 'prod-sofa-modular-toscana',
        sku: 'SOF-TOS-SAL',
        nombre_variante: 'Verde Salvia',
        color_nombre: 'Verde Salvia',
        color_hex: '#5E6B56',
        stock: 4,
        precio_adicional: 50,
        imagen_variante: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'var-sofa-carbon',
        producto_id: 'prod-sofa-modular-toscana',
        sku: 'SOF-TOS-CAR',
        nombre_variante: 'Gris Carbón',
        color_nombre: 'Gris Carbón',
        color_hex: '#2C2C2A',
        stock: 5,
        precio_adicional: 0,
        imagen_variante: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'prod-mesa-centro-nordica',
    slug: 'mesa-de-centro-organica-roble',
    nombre: 'Mesa de Centro Orgánica en Madera de Roble',
    descripcion: 'Mesa de centro con tablero de forma orgánica y bordes biselados. Diseñada para aportar fluidez y calidez natural a cualquier espacio de sala.',
    descripcion_corta: 'Tablero suavemente curvado en madera maciza de roble claro.',
    categoria_id: 'cat-sala',
    categoria_nombre: 'Sala y Estar',
    marca: 'Nórdica Home',
    precio_base: 480.00,
    precio_anterior: 560.00,
    descuento_porcentaje: 14,
    imagen_principal: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80',
    galeria_imagenes: [
      'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?auto=format&fit=crop&w=800&q=80'
    ],
    dimensiones: '110 cm x 65 cm x 42 cm',
    cuidados: 'Limpiar con paño ligeramente humedecido. Proteger de líquidos y objetos calientes con posavasos.',
    caracteristicas: [
      'Madera maciza de roble certificada FSC',
      'Acabado mate protector al agua',
      'Forma orgánica libre de esquinas puntiagudas',
      'Fácil ensamblaje de patas en 5 minutos'
    ],
    estado: 'Más vendido',
    activo: true,
    calificacion_promedio: 4.8,
    total_resenas: 19,
    destacado: true,
    novedad_bajo_100: false,
    variantes: [
      {
        id: 'var-mesa-roble-natural',
        producto_id: 'prod-mesa-centro-nordica',
        sku: 'MES-ROB-NAT',
        nombre_variante: 'Roble Claro Natural',
        color_nombre: 'Roble Claro',
        color_hex: '#D2B48C',
        stock: 8,
        precio_adicional: 0
      },
      {
        id: 'var-mesa-roble-nogal',
        producto_id: 'prod-mesa-centro-nordica',
        sku: 'MES-ROB-NOG',
        nombre_variante: 'Nogal Oscuro',
        color_nombre: 'Nogal Cálido',
        color_hex: '#5C4033',
        stock: 5,
        precio_adicional: 20
      }
    ]
  },
  {
    id: 'prod-butaca-lino-siena',
    slug: 'butaca-individual-siena-lino',
    nombre: 'Butaca Individual Siena en Lino y Fresno',
    descripcion: 'Sillón individual con respaldo ergonómico curvo y apoyabrazos integrados en madera de fresno natural. Ideal para un rincón de lectura con encanto atemporal.',
    descripcion_corta: 'Butaca envolvente con respaldo curvo y brazos en fresno.',
    categoria_id: 'cat-sala',
    categoria_nombre: 'Sala y Estar',
    marca: 'CasaViva Studio',
    precio_base: 650.00,
    precio_anterior: 790.00,
    descuento_porcentaje: 18,
    imagen_principal: 'https://images.unsplash.com/photo-1580481077195-72263050a417?auto=format&fit=crop&w=800&q=80',
    galeria_imagenes: [
      'https://images.unsplash.com/photo-1580481077195-72263050a417?auto=format&fit=crop&w=800&q=80'
    ],
    dimensiones: '78 cm x 80 cm x 85 cm',
    cuidados: 'Limpieza en seco profesional recomendada.',
    caracteristicas: ['Tapizado en mezcla lino-algodón', 'Asiento acolchado de alta densidad'],
    estado: 'Nuevo',
    activo: true,
    calificacion_promedio: 4.7,
    total_resenas: 12,
    destacado: false,
    novedad_bajo_100: false,
    variantes: [
      {
        id: 'var-butaca-arena',
        producto_id: 'prod-butaca-lino-siena',
        sku: 'BUT-SIE-ARE',
        nombre_variante: 'Arena Suave',
        color_nombre: 'Arena',
        color_hex: '#E8E2D8',
        stock: 4,
        precio_adicional: 0
      },
      {
        id: 'var-butaca-terracota',
        producto_id: 'prod-butaca-lino-siena',
        sku: 'BUT-SIE-TER',
        nombre_variante: 'Terracota Cálido',
        color_nombre: 'Terracota',
        color_hex: '#C86D51',
        stock: 3,
        precio_adicional: 0
      }
    ]
  },

  // ILUMINACION
  {
    id: 'prod-lampara-pie-nordica',
    slug: 'lampara-de-pie-arco-minimalista',
    nombre: 'Lámpara de Pie Minimalista con Pantalla de Lino',
    descripcion: 'Lámpara de pie de silueta esbelta con base pesada en mármol blanco y pantalla cilíndrica en lino texturado. Difunde una luz cálida y relajante perfecta para veladas nocturnas.',
    descripcion_corta: 'Luz ambiental suave con pantalla de lino y base de mármol.',
    categoria_id: 'cat-iluminacion',
    categoria_nombre: 'Iluminación',
    marca: 'Nórdica Home',
    precio_base: 249.00,
    precio_anterior: 299.00,
    descuento_porcentaje: 17,
    imagen_principal: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    galeria_imagenes: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80'
    ],
    dimensiones: '155 cm (alto) x 38 cm (diámetro de base)',
    cuidados: 'Limpiar con plumero o paño seco de microfibra.',
    caracteristicas: [
      'Casquillo estándar E27 compatible con bombillas LED regulables',
      'Interruptor de pie accesible en cable textil de 2 metros',
      'Base estable de mármol macizo'
    ],
    estado: 'Selección CasaViva',
    activo: true,
    calificacion_promedio: 4.9,
    total_resenas: 34,
    destacado: true,
    novedad_bajo_100: false,
    variantes: [
      {
        id: 'var-lampara-laton',
        producto_id: 'prod-lampara-pie-nordica',
        sku: 'LAM-PIE-LAT',
        nombre_variante: 'Latón Cepillado & Lino Blanco',
        color_nombre: 'Latón Cepillado',
        color_hex: '#C5A059',
        stock: 9,
        precio_adicional: 0
      },
      {
        id: 'var-lampara-negro',
        producto_id: 'prod-lampara-pie-nordica',
        sku: 'LAM-PIE-NEG',
        nombre_variante: 'Negro Mate & Lino Crudo',
        color_nombre: 'Negro Mate',
        color_hex: '#1F1F1F',
        stock: 7,
        precio_adicional: 0
      }
    ]
  },
  {
    id: 'prod-lampara-mesa-ceramica',
    slug: 'lampara-de-mesa-artesanal-arcilla',
    nombre: 'Lámpara de Mesa Cerámica en Arcilla Terracota',
    descripcion: 'Pequeña joya lumínica modelada a mano con base de gres terracota y pantalla de lino plisado. Da vida a mesas de noche y repisas.',
    descripcion_corta: 'Base de cerámica artesanal con pantalla de lino texturado.',
    categoria_id: 'cat-iluminacion',
    categoria_nombre: 'Iluminación',
    marca: 'Artesanías del Valle',
    precio_base: 89.00,
    precio_anterior: 110.00,
    descuento_porcentaje: 19,
    imagen_principal: 'https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?auto=format&fit=crop&w=800&q=80',
    galeria_imagenes: [
      'https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?auto=format&fit=crop&w=800&q=80'
    ],
    dimensiones: '32 cm (alto) x 20 cm (diámetro)',
    cuidados: 'Limpiar con paño seco.',
    caracteristicas: ['Acabado cerámico artesanal', 'Bombilla LED incluida'],
    estado: 'Oferta',
    activo: true,
    calificacion_promedio: 4.8,
    total_resenas: 16,
    destacado: false,
    novedad_bajo_100: true,
    variantes: [
      {
        id: 'var-lamp-mes-terra',
        producto_id: 'prod-lampara-mesa-ceramica',
        sku: 'LAM-MES-TER',
        nombre_variante: 'Terracota Natural',
        color_nombre: 'Terracota',
        color_hex: '#C86D51',
        stock: 12,
        precio_adicional: 0
      },
      {
        id: 'var-lamp-mes-blanco',
        producto_id: 'prod-lampara-mesa-ceramica',
        sku: 'LAM-MES-BLA',
        nombre_variante: 'Blanco Arena Esmaltado',
        color_nombre: 'Blanco Arena',
        color_hex: '#EFECE6',
        stock: 10,
        precio_adicional: 0
      }
    ]
  },

  // ACCESORIOS Y TEXTILES (BAJO S/ 100)
  {
    id: 'prod-alfombra-yute-organica',
    slug: 'alfombra-circular-yute-trenzado',
    nombre: 'Alfombra Circular en Yute Natural Trenzado',
    descripcion: 'Alfombra tejida a mano por artesanos usando 100% fibra de yute natural de cultivo sostenible. Aporta textura orgánica y calidez mediterránea.',
    descripcion_corta: '100% fibra de yute natural tejida a mano.',
    categoria_id: 'cat-accesorios',
    categoria_nombre: 'Accesorios y Textiles',
    marca: 'CasaViva Studio',
    precio_base: 139.00,
    precio_anterior: 169.00,
    descuento_porcentaje: 18,
    imagen_principal: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    galeria_imagenes: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
    ],
    dimensiones: '140 cm de diámetro',
    cuidados: 'Aspirar periódicamente. No lavar en lavadora.',
    caracteristicas: ['Yute natural trenzado de alta durabilidad', 'Reversible'],
    estado: 'Más vendido',
    activo: true,
    calificacion_promedio: 4.8,
    total_resenas: 42,
    destacado: true,
    novedad_bajo_100: false,
    variantes: [
      {
        id: 'var-alf-yute-nat',
        producto_id: 'prod-alfombra-yute-organica',
        sku: 'ALF-YUT-NAT',
        nombre_variante: 'Yute Dorado Natural',
        color_nombre: 'Yute Dorado',
        color_hex: '#C2A36B',
        stock: 14,
        precio_adicional: 0
      }
    ]
  },
  {
    id: 'prod-cojin-lino-lavado',
    slug: 'funda-cojin-lino-frances-lavado',
    nombre: 'Funda de Cojín en Lino Francés Lavado 45x45 cm',
    descripcion: 'Funda de cojín confeccionada en puro lino europeo lavado a la piedra, lo que le otorga una suavidad inigualable y ese aspecto arrugado desenfadado tan característico.',
    descripcion_corta: 'Puro lino lavado a la piedra con cierre invisible.',
    categoria_id: 'cat-accesorios',
    categoria_nombre: 'Accesorios y Textiles',
    marca: 'Lino & Madera',
    precio_base: 45.00,
    precio_anterior: 59.00,
    descuento_porcentaje: 24,
    imagen_principal: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80',
    galeria_imagenes: [
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80'
    ],
    dimensiones: '45 cm x 45 cm',
    cuidados: 'Lavar a máquina en ciclo suave a 30°C. No usar lejía.',
    caracteristicas: ['100% lino lavado pre-encogido', 'Cierre con cremallera invisible'],
    estado: 'Oferta',
    activo: true,
    calificacion_promedio: 4.9,
    total_resenas: 58,
    destacado: true,
    novedad_bajo_100: true,
    variantes: [
      {
        id: 'var-cojin-salvia',
        producto_id: 'prod-cojin-lino-lavado',
        sku: 'COJ-LIN-SAL',
        nombre_variante: 'Verde Salvia',
        color_nombre: 'Verde Salvia',
        color_hex: '#5E6B56',
        stock: 25,
        precio_adicional: 0
      },
      {
        id: 'var-cojin-arena',
        producto_id: 'prod-cojin-lino-lavado',
        sku: 'COJ-LIN-ARE',
        nombre_variante: 'Arena Natural',
        color_nombre: 'Arena',
        color_hex: '#E8E2D8',
        stock: 30,
        precio_adicional: 0
      },
      {
        id: 'var-cojin-terracota',
        producto_id: 'prod-cojin-lino-lavado',
        sku: 'COJ-LIN-TER',
        nombre_variante: 'Terracota Cálido',
        color_nombre: 'Terracota',
        color_hex: '#C86D51',
        stock: 18,
        precio_adicional: 0
      },
      {
        id: 'var-cojin-mostaza',
        producto_id: 'prod-cojin-lino-lavado',
        sku: 'COJ-LIN-MOS',
        nombre_variante: 'Mostaza Suave',
        color_nombre: 'Mostaza',
        color_hex: '#D4A347',
        stock: 15,
        precio_adicional: 0
      }
    ]
  },
  {
    id: 'prod-manta-waffle-algodon',
    slug: 'manta-throw-waffle-algodon-organico',
    nombre: 'Manta Throw Textura Waffle en Algodón Orgánico',
    descripcion: 'Manta ligera y transpirable con relieve nido de abeja (waffle). Perfecta para los pies de cama o sobre el respaldo del sofá.',
    descripcion_corta: 'Algodón orgánico peinado con textura gofrada ultra suave.',
    categoria_id: 'cat-accesorios',
    categoria_nombre: 'Accesorios y Textiles',
    marca: 'CasaViva Studio',
    precio_base: 85.00,
    precio_anterior: 105.00,
    descuento_porcentaje: 19,
    imagen_principal: 'https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?auto=format&fit=crop&w=800&q=80',
    galeria_imagenes: [
      'https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?auto=format&fit=crop&w=800&q=80'
    ],
    dimensiones: '130 cm x 170 cm',
    cuidados: 'Lavar con agua fría. Secar al aire libre a la sombra.',
    caracteristicas: ['Certificación OEKO-TEX Standard 100', 'No pierde suavidad tras los lavados'],
    estado: 'Nuevo',
    activo: true,
    calificacion_promedio: 4.8,
    total_resenas: 21,
    destacado: false,
    novedad_bajo_100: true,
    variantes: [
      {
        id: 'var-manta-marfil',
        producto_id: 'prod-manta-waffle-algodon',
        sku: 'MAN-WAF-MAR',
        nombre_variante: 'Marfil Crema',
        color_nombre: 'Marfil Crema',
        color_hex: '#FAF6ED',
        stock: 15,
        precio_adicional: 0
      },
      {
        id: 'var-manta-oliva',
        producto_id: 'prod-manta-waffle-algodon',
        sku: 'MAN-WAF-OLI',
        nombre_variante: 'Verde Oliva',
        color_nombre: 'Verde Oliva',
        color_hex: '#4A5643',
        stock: 12,
        precio_adicional: 0
      }
    ]
  },

  // DECORACION (BAJO S/ 100)
  {
    id: 'prod-florero-ceramica-organico',
    slug: 'florero-ceramico-escultorico-duna',
    nombre: 'Florero Cerámico Escultórico Duna',
    descripcion: 'Pieza decorativa de silueta ondulante inspirada en las dunas costeras peruanas. Acabado mate rugoso al tacto.',
    descripcion_corta: 'Silueta escultórica contemporánea en cerámica mate.',
    categoria_id: 'cat-decoracion',
    categoria_nombre: 'Decoración',
    marca: 'Artesanías del Valle',
    precio_base: 59.00,
    precio_anterior: 75.00,
    descuento_porcentaje: 21,
    imagen_principal: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
    galeria_imagenes: [
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80'
    ],
    dimensiones: '24 cm (alto) x 15 cm (ancho)',
    cuidados: 'Apto para agua. Limpiar con paño suave.',
    caracteristicas: ['Impermeabilizado interior', 'Base protegida contra rayaduras'],
    estado: 'Más vendido',
    activo: true,
    calificacion_promedio: 4.9,
    total_resenas: 31,
    destacado: true,
    novedad_bajo_100: true,
    variantes: [
      {
        id: 'var-flor-arena',
        producto_id: 'prod-florero-ceramica-organico',
        sku: 'FLO-DUN-ARE',
        nombre_variante: 'Arena Caliza',
        color_nombre: 'Arena Caliza',
        color_hex: '#E5DDCB',
        stock: 20,
        precio_adicional: 0
      },
      {
        id: 'var-flor-terracota',
        producto_id: 'prod-florero-ceramica-organico',
        sku: 'FLO-DUN-TER',
        nombre_variante: 'Terracota Rústico',
        color_nombre: 'Terracota Rústico',
        color_hex: '#BA5C44',
        stock: 14,
        precio_adicional: 0
      }
    ]
  },
  {
    id: 'prod-vela-aromatica-soja',
    slug: 'vela-soja-natural-cedro-higo',
    nombre: 'Vela Aromática en Vaso de Cerámica (Cedro & Higo)',
    descripcion: 'Vela elaborada con cera de soja 100% botánica y mecha de madera crujiente. Notas amaderadas de cedro, higo maduro y un toque fresco de bergamota.',
    descripcion_corta: 'Cera de soja botánica en cuenco reutilizable de gres artesanal.',
    categoria_id: 'cat-decoracion',
    categoria_nombre: 'Decoración',
    marca: 'CasaViva Studio',
    precio_base: 39.90,
    precio_anterior: 49.90,
    descuento_porcentaje: 20,
    imagen_principal: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
    galeria_imagenes: [
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80'
    ],
    dimensiones: '9 cm x 8 cm (Duración aprox: 45 horas)',
    cuidados: 'Cortar la mecha a 5 mm antes de cada encendido.',
    caracteristicas: ['Libre de parafinas y tóxicos', 'Vaso reutilizable como maceta o portalápices'],
    estado: 'Nuevo',
    activo: true,
    calificacion_promedio: 5.0,
    total_resenas: 45,
    destacado: true,
    novedad_bajo_100: true,
    variantes: [
      {
        id: 'var-vela-cedro',
        producto_id: 'prod-vela-aromatica-soja',
        sku: 'VEL-SOJ-CED',
        nombre_variante: 'Cedro & Higo Silvestre',
        color_nombre: 'Cedro & Higo',
        color_hex: '#D7C4B7',
        stock: 35,
        precio_adicional: 0
      },
      {
        id: 'var-vela-salvia',
        producto_id: 'prod-vela-aromatica-soja',
        sku: 'VEL-SOJ-SAL',
        nombre_variante: 'Salvia Blanca & Lavanda',
        color_nombre: 'Salvia & Lavanda',
        color_hex: '#C0CEB2',
        stock: 28,
        precio_adicional: 0
      }
    ]
  },
  {
    id: 'prod-espejo-organico-pared',
    slug: 'espejo-pared-forma-organica-borde-laton',
    nombre: 'Espejo de Pared con Silueta Orgánica y Marco Fino',
    descripcion: 'Espejo contemporáneo con forma asimétrica fluida. Aporta luminosidad y amplitud visual a pasillos, salas o dormitorios.',
    descripcion_corta: 'Diseño asimétrico con marco ultra delgado y cristal de alta definición.',
    categoria_id: 'cat-decoracion',
    categoria_nombre: 'Decoración',
    marca: 'Nórdica Home',
    precio_base: 185.00,
    precio_anterior: 220.00,
    descuento_porcentaje: 16,
    imagen_principal: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=800&q=80',
    galeria_imagenes: [
      'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=800&q=80'
    ],
    dimensiones: '75 cm x 55 cm',
    cuidados: 'Limpiar con limpiavidrios y paño suave sin pelusas.',
    caracteristicas: ['Cristal libre de plomo y cobre', 'Incluye anclajes para colgar vertical u horizontal'],
    estado: 'Selección CasaViva',
    activo: true,
    calificacion_promedio: 4.8,
    total_resenas: 18,
    destacado: false,
    novedad_bajo_100: false,
    variantes: [
      {
        id: 'var-esp-dorado',
        producto_id: 'prod-espejo-organico-pared',
        sku: 'ESP-ORG-DOR',
        nombre_variante: 'Marco Dorado Envejecido',
        color_nombre: 'Dorado Envejecido',
        color_hex: '#CCA86E',
        stock: 8,
        precio_adicional: 0
      },
      {
        id: 'var-esp-negro',
        producto_id: 'prod-espejo-organico-pared',
        sku: 'ESP-ORG-NEG',
        nombre_variante: 'Marco Negro Mate',
        color_nombre: 'Negro Mate',
        color_hex: '#222222',
        stock: 6,
        precio_adicional: 0
      }
    ]
  },

  // COCINA Y COMEDOR
  {
    id: 'prod-set-vajilla-gres',
    slug: 'set-vajilla-artesanal-gres-16-piezas',
    nombre: 'Set de Vajilla Artesanal de Gres (16 Piezas)',
    descripcion: 'Colección completa para 4 comensales en gres cocido a alta temperatura con bordes irregulares orgánicos y esmalte reactivo mate.',
    descripcion_corta: '4 platos tendidos, 4 hondos, 4 de postre y 4 bowls en gres esmaltado.',
    categoria_id: 'cat-cocina',
    categoria_nombre: 'Cocina y Comedor',
    marca: 'Artesanías del Valle',
    precio_base: 289.00,
    precio_anterior: 340.00,
    descuento_porcentaje: 15,
    imagen_principal: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=800&q=80',
    galeria_imagenes: [
      'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=800&q=80'
    ],
    dimensiones: 'Platos 27cm, 21cm, Bowls 16cm',
    cuidados: 'Apto para lavavajillas y microondas.',
    caracteristicas: ['Resistente al desportillado', 'Acabado reactivo único en cada pieza'],
    estado: 'Selección CasaViva',
    activo: true,
    calificacion_promedio: 4.9,
    total_resenas: 27,
    destacado: true,
    novedad_bajo_100: false,
    variantes: [
      {
        id: 'var-vajilla-arena',
        producto_id: 'prod-set-vajilla-gres',
        sku: 'VAJ-GRE-ARE',
        nombre_variante: 'Arena Moteado',
        color_nombre: 'Arena Moteado',
        color_hex: '#DDD6C6',
        stock: 7,
        precio_adicional: 0
      },
      {
        id: 'var-vajilla-salvia',
        producto_id: 'prod-set-vajilla-gres',
        sku: 'VAJ-GRE-SAL',
        nombre_variante: 'Verde Salvia Ahumado',
        color_nombre: 'Verde Salvia Ahumado',
        color_hex: '#8A9784',
        stock: 5,
        precio_adicional: 15
      }
    ]
  },
  {
    id: 'prod-tabla-madera-olivo',
    slug: 'tabla-servir-madera-olivo-macizo',
    nombre: 'Tabla de Servir y Picar en Madera de Olivo Macizo',
    descripcion: 'Tabla rústica con veta natural pronunciada y mango ergonómico con tira de cuero para colgar. Ideal para tablas de quesos y aperitivos.',
    descripcion_corta: 'Madera de olivo curada con aceite de cera de abejas vegetal.',
    categoria_id: 'cat-cocina',
    categoria_nombre: 'Cocina y Comedor',
    marca: 'Lino & Madera',
    precio_base: 69.00,
    precio_anterior: 89.00,
    descuento_porcentaje: 22,
    imagen_principal: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=800&q=80',
    galeria_imagenes: [
      'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=800&q=80'
    ],
    dimensiones: '42 cm x 22 cm x 2 cm',
    cuidados: 'Lavar a mano. Hidratar con aceite de grado alimenticio mensualmente.',
    caracteristicas: ['Antibacteriano natural', 'Mango con cordón de cuero'],
    estado: 'Nuevo',
    activo: true,
    calificacion_promedio: 4.8,
    total_resenas: 33,
    destacado: false,
    novedad_bajo_100: true,
    variantes: [
      {
        id: 'var-tabla-olivo',
        producto_id: 'prod-tabla-madera-olivo',
        sku: 'TAB-OLI-MAC',
        nombre_variante: 'Olivo Natural Encerado',
        color_nombre: 'Olivo Natural',
        color_hex: '#BA8C53',
        stock: 22,
        precio_adicional: 0
      }
    ]
  },

  // ORGANIZACION (BAJO S/ 100)
  {
    id: 'prod-cesta-seagrass-set3',
    slug: 'set-3-cestas-organizadoras-seagrass',
    nombre: 'Set de 3 Cestas Organizadoras en Fibra de Seagrass',
    descripcion: 'Trío de cestas anidables con asas integradas. Excelentes para toallas de mano en el baño, mantas en la sala o juguetes en el cuarto infantil.',
    descripcion_corta: 'Fibra vegetal natural tejida a mano con asas reforzadas.',
    categoria_id: 'cat-organizacion',
    categoria_nombre: 'Organización',
    marca: 'CasaViva Studio',
    precio_base: 95.00,
    precio_anterior: 120.00,
    descuento_porcentaje: 21,
    imagen_principal: 'https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?auto=format&fit=crop&w=800&q=80',
    galeria_imagenes: [
      'https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?auto=format&fit=crop&w=800&q=80'
    ],
    dimensiones: 'Grande: 30x25cm, Mediana: 26x22cm, Pequeña: 22x18cm',
    cuidados: 'Limpiar con paño seco o cepillo de cerdas suaves.',
    caracteristicas: ['Fibras naturales 100% biodegradables', 'Estructura flexible y resistente'],
    estado: 'Más vendido',
    activo: true,
    calificacion_promedio: 4.9,
    total_resenas: 39,
    destacado: true,
    novedad_bajo_100: true,
    variantes: [
      {
        id: 'var-ces-nat',
        producto_id: 'prod-cesta-seagrass-set3',
        sku: 'CES-SEA-SET',
        nombre_variante: 'Natural & Blanco Crema',
        color_nombre: 'Natural & Blanco',
        color_hex: '#D9C8A9',
        stock: 18,
        precio_adicional: 0
      }
    ]
  },
  {
    id: 'prod-organizador-cajon-bambu',
    slug: 'organizador-extensible-cubiertos-bambu',
    nombre: 'Organizador Extensible para Cajón en Bambú Natural',
    descripcion: 'Bandeja divisoria modular de 6 a 8 compartimentos con ancho ajustable. Orden impecable para cubertería y utensilios.',
    descripcion_corta: 'Ancho extensible de 32 cm a 52 cm en bambú sostenible.',
    categoria_id: 'cat-organizacion',
    categoria_nombre: 'Organización',
    marca: 'Lino & Madera',
    precio_base: 65.00,
    precio_anterior: 80.00,
    descuento_porcentaje: 19,
    imagen_principal: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    galeria_imagenes: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'
    ],
    dimensiones: '43 cm (largo) x 32 a 52 cm (ancho extensible) x 5 cm (alto)',
    cuidados: 'Limpiar con trapo húmedo y secar de inmediato.',
    caracteristicas: ['Bambú antibacteriano', 'Laterales deslizantes suaves'],
    estado: 'Nuevo',
    activo: true,
    calificacion_promedio: 4.7,
    total_resenas: 14,
    destacado: false,
    novedad_bajo_100: true,
    variantes: [
      {
        id: 'var-org-bam',
        producto_id: 'prod-organizador-cajon-bambu',
        sku: 'ORG-BAM-EXT',
        nombre_variante: 'Bambú Rubio',
        color_nombre: 'Bambú Rubio',
        color_hex: '#D6BA8B',
        stock: 25,
        precio_adicional: 0
      }
    ]
  },

  // BAÑO (BAJO S/ 100)
  {
    id: 'prod-set-toallas-algodon-pima',
    slug: 'set-toallas-bano-algodon-pima-600gsm',
    nombre: 'Set de Toallas Premium (Cuerpo y Mano) en Algodón Pima 600 GSM',
    descripcion: 'Dúo de toallas ultrasuaves confeccionadas con hilado peinado de fino algodón Pima peruano. Alta capacidad de absorción y secado rápido.',
    descripcion_corta: 'Algodón Pima peruano extra mullido y súper absorbente.',
    categoria_id: 'cat-bano',
    categoria_nombre: 'Baño',
    marca: 'CasaViva Studio',
    precio_base: 89.00,
    precio_anterior: 115.00,
    descuento_porcentaje: 23,
    imagen_principal: 'https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&w=800&q=80',
    galeria_imagenes: [
      'https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&w=800&q=80'
    ],
    dimensiones: 'Toalla Cuerpo: 140x70cm, Toalla Mano: 80x50cm',
    cuidados: 'Lavar antes del primer uso a 40°C sin suavizantes.',
    caracteristicas: ['600 gramos por m²', 'Cero desprendimiento de motas'],
    estado: 'Oferta',
    activo: true,
    calificacion_promedio: 4.9,
    total_resenas: 48,
    destacado: true,
    novedad_bajo_100: true,
    variantes: [
      {
        id: 'var-toa-marfil',
        producto_id: 'prod-set-toallas-algodon-pima',
        sku: 'TOA-PIM-MAR',
        nombre_variante: 'Marfil Suave',
        color_nombre: 'Marfil Suave',
        color_hex: '#FAF6EF',
        stock: 20,
        precio_adicional: 0
      },
      {
        id: 'var-toa-salvia',
        producto_id: 'prod-set-toallas-algodon-pima',
        sku: 'TOA-PIM-SAL',
        nombre_variante: 'Verde Salvia',
        color_nombre: 'Verde Salvia',
        color_hex: '#5E6B56',
        stock: 18,
        precio_adicional: 0
      },
      {
        id: 'var-toa-ceniza',
        producto_id: 'prod-set-toallas-algodon-pima',
        sku: 'TOA-PIM-CEN',
        nombre_variante: 'Gris Ceniza',
        color_nombre: 'Gris Ceniza',
        color_hex: '#989895',
        stock: 15,
        precio_adicional: 0
      }
    ]
  },
  {
    id: 'prod-dispensador-ceramica-mate',
    slug: 'set-dispensador-jabon-vaso-ceramica-mate',
    nombre: 'Set de Baño: Dispensador de Jabón y Vaso Cerámico',
    descripcion: 'Elegante conjunto de baño con bomba metálica antioxidante y acabado cerámico estriado mate.',
    descripcion_corta: 'Cerámica estriada mate con dosificador en latón inoxidable.',
    categoria_id: 'cat-bano',
    categoria_nombre: 'Baño',
    marca: 'Artesanías del Valle',
    precio_base: 49.00,
    precio_anterior: 65.00,
    descuento_porcentaje: 25,
    imagen_principal: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    galeria_imagenes: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'
    ],
    dimensiones: 'Dispensador 350ml (18cm alto), Vaso (11cm alto)',
    cuidados: 'Enjuagar periódicamente el cabezal de la bomba con agua tibia.',
    caracteristicas: ['Bomba antigoteo de alta durabilidad', 'Base pesada antideslizante'],
    estado: 'Nuevo',
    activo: true,
    calificacion_promedio: 4.8,
    total_resenas: 22,
    destacado: false,
    novedad_bajo_100: true,
    variantes: [
      {
        id: 'var-dis-arena',
        producto_id: 'prod-dispensador-ceramica-mate',
        sku: 'DIS-CER-ARE',
        nombre_variante: 'Arena Estriada',
        color_nombre: 'Arena Estriada',
        color_hex: '#E2DBD0',
        stock: 24,
        precio_adicional: 0
      },
      {
        id: 'var-dis-carbon',
        producto_id: 'prod-dispensador-ceramica-mate',
        sku: 'DIS-CER-CAR',
        nombre_variante: 'Negro Carbón Estriado',
        color_nombre: 'Negro Carbón',
        color_hex: '#2B2B2B',
        stock: 19,
        precio_adicional: 0
      }
    ]
  },

  // DORMITORIO
  {
    id: 'prod-duvet-lino-lavado',
    slug: 'funda-duvet-lino-puro-king-queen',
    nombre: 'Funda Nórdica Duvet en 100% Puro Lino Lavado',
    descripcion: 'Juego de funda para edredón y dos fundas de almohada a juego. El lino es termorregulador natural: fresco en verano y abrigador en invierno.',
    descripcion_corta: 'Puro lino transpirable prelavado que mejora con cada lavado.',
    categoria_id: 'cat-dormitorio',
    categoria_nombre: 'Dormitorio',
    marca: 'Lino & Madera',
    precio_base: 380.00,
    precio_anterior: 460.00,
    descuento_porcentaje: 17,
    imagen_principal: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80',
    galeria_imagenes: [
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80'
    ],
    dimensiones: '240 cm x 220 cm (Queen / 2 Plazas)',
    cuidados: 'Lavar a 40°C. No requiere planchado para lucir su encanto natural.',
    caracteristicas: ['Botones de coco natural ocultos', 'Tiras de sujeción en las cuatro esquinas interiores'],
    estado: 'Selección CasaViva',
    activo: true,
    calificacion_promedio: 5.0,
    total_resenas: 36,
    destacado: true,
    novedad_bajo_100: false,
    variantes: [
      {
        id: 'var-duv-marfil',
        producto_id: 'prod-duvet-lino-lavado',
        sku: 'DUV-LIN-MAR',
        nombre_variante: 'Blanco Crudo / Marfil',
        color_nombre: 'Marfil Crudo',
        color_hex: '#FAF6ED',
        stock: 8,
        precio_adicional: 0
      },
      {
        id: 'var-duv-salvia',
        producto_id: 'prod-duvet-lino-lavado',
        sku: 'DUV-LIN-SAL',
        nombre_variante: 'Verde Salvia Suave',
        color_nombre: 'Verde Salvia',
        color_hex: '#64705C',
        stock: 6,
        precio_adicional: 20
      },
      {
        id: 'var-duv-terracota',
        producto_id: 'prod-duvet-lino-lavado',
        sku: 'DUV-LIN-TER',
        nombre_variante: 'Terracota Ceniza',
        color_nombre: 'Terracota Ceniza',
        color_hex: '#C5745F',
        stock: 5,
        precio_adicional: 20
      }
    ]
  },
  {
    id: 'prod-mesa-noche-flotante',
    slug: 'mesa-de-noche-flotante-roble-cajon',
    nombre: 'Mesa de Noche Flotante en Roble Macizo con Cajón',
    descripcion: 'Mesa de noche suspendida de pared que despeja el espacio visual del suelo. Incluye cajón con guías ocultas y cierre amortiguado.',
    descripcion_corta: 'Diseño flotante minimalista en madera de roble con pasacables.',
    categoria_id: 'cat-dormitorio',
    categoria_nombre: 'Dormitorio',
    marca: 'Nórdica Home',
    precio_base: 199.00,
    precio_anterior: 240.00,
    descuento_porcentaje: 17,
    imagen_principal: 'https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?auto=format&fit=crop&w=800&q=80',
    galeria_imagenes: [
      'https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?auto=format&fit=crop&w=800&q=80'
    ],
    dimensiones: '45 cm (ancho) x 30 cm (profundidad) x 18 cm (alto)',
    cuidados: 'Limpiar con paño seco.',
    caracteristicas: ['Cierre suave sin golpes (soft-close)', 'Soporta hasta 20 kg instalada en pared sólida'],
    estado: 'Nuevo',
    activo: true,
    calificacion_promedio: 4.8,
    total_resenas: 15,
    destacado: false,
    novedad_bajo_100: false,
    variantes: [
      {
        id: 'var-mes-noc-nat',
        producto_id: 'prod-mesa-noche-flotante',
        sku: 'MNO-ROB-NAT',
        nombre_variante: 'Roble Natural Claro',
        color_nombre: 'Roble Claro',
        color_hex: '#D2B48C',
        stock: 10,
        precio_adicional: 0
      }
    ]
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'cup-casaviva10',
    codigo: 'CASAVIVA10',
    tipo_descuento: 'porcentaje',
    valor: 10,
    compra_minima: 50,
    limite_uso: 500,
    usos_actuales: 42,
    activo: true,
    descripcion: '10% de descuento en cualquier compra superior a S/ 50'
  },
  {
    id: 'cup-bienvenido15',
    codigo: 'BIENVENIDO15',
    tipo_descuento: 'porcentaje',
    valor: 15,
    compra_minima: 100,
    limite_uso: 1000,
    usos_actuales: 128,
    activo: true,
    descripcion: '15% de descuento exclusivo para tu primera orden sobre S/ 100'
  },
  {
    id: 'cup-hogar2026',
    codigo: 'HOGAR2026',
    tipo_descuento: 'monto_fijo',
    valor: 30,
    compra_minima: 200,
    limite_uso: 300,
    usos_actuales: 67,
    activo: true,
    descripcion: 'S/ 30 de descuento directo en compras mayores a S/ 200'
  },
  {
    id: 'cup-verano50',
    codigo: 'VERANO50',
    tipo_descuento: 'monto_fijo',
    valor: 50,
    compra_minima: 350,
    limite_uso: 100,
    usos_actuales: 18,
    activo: true,
    descripcion: 'S/ 50 de descuento directo en compras mayores a S/ 350'
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin-1',
    nombre: 'Administrador CasaViva',
    email: 'admin@casaviva.pe',
    password_hash: bcrypt.hashSync('Admin2026*CV', 10),
    telefono: '+51 987 654 321',
    rol: 'admin',
    creado_en: '2026-01-10T10:00:00.000Z'
  },
  {
    id: 'usr-cliente-1',
    nombre: 'María Claudia López',
    email: 'maria.lopez@ejemplo.com',
    password_hash: bcrypt.hashSync('Cliente123*', 10),
    telefono: '+51 912 345 678',
    rol: 'cliente',
    creado_en: '2026-02-15T14:30:00.000Z'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    producto_id: 'prod-sofa-modular-toscana',
    usuario_nombre: 'Valeria R.',
    calificacion: 5,
    titulo: 'El sofá más cómodo y estético que he tenido',
    comentario: 'La tela de lino se siente premium y suave. El color marfil es exactamente el tono cálido que buscaba para mi sala en Miraflores. Llegó muy bien protegido.',
    verificada: true,
    creado_en: '2026-08-20T12:00:00.000Z'
  },
  {
    id: 'rev-2',
    producto_id: 'prod-lampara-pie-nordica',
    usuario_nombre: 'Carlos M.',
    calificacion: 5,
    titulo: 'Luz cálida y diseño minimalista impecable',
    comentario: 'La base de mármol es muy estable y la pantalla difunde una luz preciosa por las noches. Muy fácil de armar.',
    verificada: true,
    creado_en: '2026-08-28T16:15:00.000Z'
  },
  {
    id: 'rev-3',
    producto_id: 'prod-cojin-lino-lavado',
    usuario_nombre: 'Sofía P.',
    calificacion: 5,
    titulo: 'Excelente calidad por el precio',
    comentario: 'Compré 4 cojines en salvia y arena. La textura del lino es auténtica y los colores combinan a la perfección con la madera.',
    verificada: true,
    creado_en: '2026-09-02T09:40:00.000Z'
  },
  {
    id: 'rev-4',
    producto_id: 'prod-vela-aromatica-soja',
    usuario_nombre: 'Andrea B.',
    calificacion: 5,
    titulo: 'Aroma delicioso que perfuma toda la casa',
    comentario: 'El aroma a cedro e higo es sofisticado y nada empalagoso. El cuenco cerámico quedó perfecto luego como macetita para una suculenta.',
    verificada: true,
    creado_en: '2026-09-08T18:20:00.000Z'
  }
];
