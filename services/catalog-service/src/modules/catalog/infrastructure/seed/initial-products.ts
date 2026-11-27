import type { CreateProductInput } from '../../application/use-cases/create-product.use-case.js';

export const INITIAL_PRODUCTS: readonly CreateProductInput[] = [
  {
    nombre: 'Bolsa de mano Univalle',
    descripcion:
      'Bolsa negra de asas largas con base roja y el logotipo de la Universidad del Valle al frente. Para llevar cuadernos y accesorios al campus.',
    precio: 27900,
    stock: 15,
    categoria: 'accesorios',
    imagen: '/productos/bolsa_de_mano.png',
  },
  {
    nombre: 'Camiseta blanca Univalle',
    descripcion:
      'Camiseta blanca de manga corta y cuello redondo, con el logotipo rojo de la Universidad del Valle en el pecho.',
    precio: 44900,
    stock: 20,
    categoria: 'ropa',
    imagen: '/productos/camisa_blanca.png',
  },
  {
    nombre: 'Cuaderno argollado Univalle',
    descripcion:
      'Cuaderno de espiral con portada blanca y roja y el logotipo de la Universidad del Valle. Para apuntes de clase.',
    precio: 15900,
    stock: 25,
    categoria: 'papeleria',
    imagen: '/productos/cuaderno.png',
  },
  {
    nombre: 'Saco rojo con capucha Univalle',
    descripcion:
      'Saco rojo con capucha, cordones blancos y bolsillo frontal. Lleva el logotipo de la Universidad del Valle en el pecho.',
    precio: 89900,
    stock: 12,
    categoria: 'ropa',
    imagen: '/productos/saco_rojo.png',
  },
  {
    nombre: 'Taza blanca Univalle',
    descripcion:
      'Taza blanca con asa y el logotipo rojo de la Universidad del Valle. Para café, té u otras bebidas de uso cotidiano.',
    precio: 24900,
    stock: 18,
    categoria: 'hogar',
    imagen: '/productos/taza.png',
  },
  {
    nombre: 'Termo blanco y rojo Univalle',
    descripcion:
      'Termo blanco con base roja, tapa de acabado metálico y asa superior. Lleva el logotipo de la Universidad del Valle.',
    precio: 54900,
    stock: 14,
    categoria: 'accesorios',
    imagen: '/productos/termo.png',
  },
  {
    nombre: 'Calculadora científica Casio fx-570ES PLUS',
    descripcion:
      'Calculadora científica Casio con pantalla de notación natural para visualizar expresiones, fracciones e integrales. Útil para cursos de matemáticas e ingeniería.',
    precio: 85900,
    stock: 10,
    categoria: 'tecnologia',
    imagen: '/productos/calculadora.jpg',
  },
  {
    nombre: 'Bolso lila Totto',
    descripcion:
      'Bolso de hombro color lila con asas grises y bolsillo frontal con cremallera. Para llevar cuadernos y objetos de uso diario.',
    precio: 79900,
    stock: 8,
    categoria: 'accesorios',
    imagen: '/productos/bolsototto.webp',
  },
];
