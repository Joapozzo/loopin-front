// Datos estáticos
const restaurantes = [
  {
    id: 1,
    nombre: "Luco Gourmet",
    logo: "/logos/logo-rose.svg",
    imagen: "/restaurantes/1.jpg",
    categoria: "Restaurante",
    descripcion:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum dignissim ultricies. Fusce rhoncus ipsum tempor eros aliquam consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum dignissim ultricies. Fusce rhoncus ipsum tempor eros aliquam consequat.",
    ubicacion: "Av. Callao 123, C1022 CABA, Argentina",
  },
  {
    id: 2,
    nombre: "Chez",
    logo: "/logos/logo-rose.svg",
    imagen: "/restaurantes/1.jpg",
    categoria: "Restaurante",
    descripcion:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum dignissim ultricies. Fusce rhoncus ipsum tempor eros aliquam consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum dignissim ultricies. Fusce rhoncus ipsum tempor eros aliquam consequat.",
    ubicacion: "Av. Callao 123, C1022 CABA, Argentina",
  },
];

const client = {
  id: 1,
  nombre: "Joaquin Pozzo",
  email: "joaquin@example.com",
  dni: "43450997",
  telefono: "555-123456",
};

const credencial = {
  id: 1,
  puntos: 123,
  fechaAlta: "2022-08-20",
  codigo: "123 456 789",
  restaurantId: restaurantes[0].id,
  clientId: client.id,
  restaurant: restaurantes[0],
  client,
};

export { restaurantes, client, credencial };
