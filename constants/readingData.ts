
export interface ReadingStory {
  id: number;
  title: string;
  text: string;
  translation: string;
}

export const READING_STORIES: ReadingStory[] = [
  {
    id: 1,
    title: "Mi Familia",
    text: "Mi familia es muy grande y feliz. Mi padre se llama Juan y mi madre se llama María. Ellos trabajan mucho todos los días.\n\nYo tengo dos hermanos menores. Nosotros jugamos en el parque los fines de semana. Mi abuela cocina comida muy rica para todos.",
    translation: "My family is very large and happy. My father's name is Juan and my mother's name is Maria. They work a lot every day.\n\nI have two younger brothers. We play in the park on weekends. My grandmother cooks very delicious food for everyone."
  },
  {
    id: 2,
    title: "La Escuela",
    text: "La escuela es un lugar divertido. Yo estudio español y matemáticas con mis amigos. El profesor es muy simpático y ayuda a los estudiantes.\n\nEn el recreo, nosotros comemos frutas y hablamos mucho. La biblioteca tiene muchos libros interesantes para leer.",
    translation: "School is a fun place. I study Spanish and mathematics with my friends. The teacher is very nice and helps the students.\n\nDuring recess, we eat fruit and talk a lot. The library has many interesting books to read."
  },
  {
    id: 3,
    title: "Mi Perro",
    text: "Yo tengo un perro pequeño que se llama Toby. Toby es de color café y tiene orejas largas. Él corre muy rápido en el jardín.\n\nTodos los días, yo camino con Toby por la calle. Él come comida para perros y bebe mucha agua cuando tiene calor.",
    translation: "I have a small dog named Toby. Toby is brown and has long ears. He runs very fast in the garden.\n\nEvery day, I walk with Toby on the street. He eats dog food and drinks a lot of water when he is hot."
  },
  {
    id: 4,
    title: "La Casa",
    text: "Mi casa es blanca y tiene flores rojas. La sala es grande y tiene un sofá cómodo. Yo veo la televisión con mi familia por la noche.\n\nLa cocina es moderna y limpia. Mi dormitorio tiene una cama azul y un escritorio para estudiar. Me gusta mucho mi casa.",
    translation: "My house is white and has red flowers. The living room is large and has a comfortable sofa. I watch television with my family at night.\n\nThe kitchen is modern and clean. My bedroom has a blue bed and a desk for studying. I like my house very much."
  },
  {
    id: 5,
    title: "El Desayuno",
    text: "Por la mañana, yo tengo mucha hambre. Siempre como pan con queso y bebo un café con leche. Mi hermana prefiere comer cereales con yogur.\n\nNosotros hablamos sobre los planes del día. El desayuno es la comida más importante para tener energía. Después, voy a la escuela.",
    translation: "In the morning, I am very hungry. I always eat bread with cheese and drink coffee with milk. My sister prefers to eat cereal with yogurt.\n\nWe talk about the plans for the day. Breakfast is the most important meal to have energy. Afterwards, I go to school."
  },
  {
    id: 6,
    title: "El Mercado",
    text: "El mercado central vende muchas cosas frescas. Hay frutas, verduras, carne y pescado. La gente compra comida para la semana.\n\nLos vendedores son muy amables y gritan los precios. Yo compro manzanas rojas y plátanos amarillos. El mercado es un lugar con mucho color.",
    translation: "The central market sells many fresh things. There are fruits, vegetables, meat, and fish. People buy food for the week.\n\nThe vendors are very friendly and shout the prices. I buy red apples and yellow bananas. The market is a place with a lot of color."
  },
  {
    id: 7,
    title: "Mi Amigo",
    text: "Mi mejor amigo se llama Carlos. Él vive cerca de mi casa y estudiamos juntos. Carlos es alto y lleva gafas negras.\n\nNosotros escuchamos música y practicamos deportes. Los sábados vamos al cine para ver películas de acción. Carlos es una persona muy divertida.",
    translation: "My best friend's name is Carlos. He lives near my house and we study together. Carlos is tall and wears black glasses.\n\nWe listen to music and practice sports. On Saturdays we go to the cinema to watch action movies. Carlos is a very fun person."
  },
  {
    id: 8,
    title: "El Parque",
    text: "El parque de mi ciudad es muy bonito. Hay muchos árboles verdes y flores de colores. Los niños corren y juegan con pelotas.\n\nMuchas personas caminan con sus mascotas o leen libros. Yo descanso bajo un árbol cuando hace sol. El aire es muy puro en el parque.",
    translation: "The park in my city is very beautiful. There are many green trees and colorful flowers. Children run and play with balls.\n\nMany people walk with their pets or read books. I rest under a tree when it is sunny. The air is very pure in the park."
  },
  {
    id: 9,
    title: "La Ropa",
    text: "Hoy llevo una camiseta azul y unos pantalones negros. Mis zapatos son blancos y muy cómodos. En invierno, yo uso una chaqueta grande.\n\nMi hermana lleva un vestido rosa y un sombrero de sol. A nosotros nos gusta la ropa de colores claros. La moda es interesante para muchas personas.",
    translation: "Today I am wearing a blue t-shirt and black pants. My shoes are white and very comfortable. In winter, I use a large jacket.\n\nMy sister is wearing a pink dress and a sun hat. We like light-colored clothes. Fashion is interesting for many people."
  },
  {
    id: 10,
    title: "El Restaurante",
    text: "El restaurante italiano prepara pizzas deliciosas. El camarero trae el menú y nosotros pedimos agua mineral. La música es suave y relajante.\n\nDe postre, yo como un helado de chocolate. La cuenta no es muy cara y la comida es excelente. Siempre vuelvo a este lugar con mis amigos.",
    translation: "The Italian restaurant prepares delicious pizzas. The waiter brings the menu and we order mineral water. The music is soft and relaxing.\n\nFor dessert, I eat chocolate ice cream. The bill is not very expensive and the food is excellent. I always return to this place with my friends."
  },
  {
    id: 11,
    title: "El Trabajo",
    text: "Mi tío trabaja en una oficina grande en el centro. Él escribe correos electrónicos y habla por teléfono. Su jefe es una persona seria.\n\nÉl llega a casa a las seis de la tarde. Está cansado pero está contento con su profesión. Los fines de semana él no trabaja y descansa mucho.",
    translation: "My uncle works in a large office downtown. He writes emails and talks on the phone. His boss is a serious person.\n\nHe arrives home at six in the evening. He is tired but happy with his profession. On weekends he does not work and rests a lot."
  },
  {
    id: 12,
    title: "El Tiempo",
    text: "Hoy hace mucho sol y el cielo es azul. No hay nubes y la temperatura es alta. Es un día perfecto para ir a la playa.\n\nEn primavera, llueve un poco y las flores crecen. A mí me gusta cuando hace fresco pero no mucho frío. El tiempo cambia mucho en mi país.",
    translation: "Today it is very sunny and the sky is blue. There are no clouds and the temperature is high. It is a perfect day to go to the beach.\n\nIn spring, it rains a little and the flowers grow. I like it when it is cool but not very cold. The weather changes a lot in my country."
  },
  {
    id: 13,
    title: "La Ciudad",
    text: "La ciudad tiene muchos edificios altos y calles anchas. Hay mucho tráfico y ruido durante el día. Los autobuses llevan a la gente al trabajo.\n\nPor la noche, las luces de la ciudad son brillantes. Hay muchos museos, teatros y tiendas modernas. Me gusta vivir en un lugar con mucha actividad.",
    translation: "The city has many tall buildings and wide streets. There is a lot of traffic and noise during the day. Buses take people to work.\n\nAt night, the city lights are bright. There are many museums, theaters, and modern shops. I like living in a place with a lot of activity."
  },
  {
    id: 14,
    title: "Las Vacaciones",
    text: "En verano, mi familia y yo vamos a la montaña. Nosotros caminamos por los senderos y vemos animales. Dormimos en una casa de madera.\n\nEl aire es fresco y el paisaje es increíble. Sacamos muchas fotos de la naturaleza. Las vacaciones son necesarias para desconectar de la rutina.",
    translation: "In summer, my family and I go to the mountains. We walk along the trails and see animals. We sleep in a wooden house.\n\nThe air is fresh and the landscape is incredible. We take many photos of nature. Vacations are necessary to disconnect from the routine."
  },
  {
    id: 15,
    title: "El Deporte",
    text: "El fútbol es el deporte más popular en mi país. Yo juego con mis amigos todos los martes. Nosotros corremos mucho y marcamos goles.\n\nMi hermano prefiere nadar en la piscina municipal. El deporte es bueno para la salud y para hacer amigos. Siempre estamos activos y en forma.",
    translation: "Soccer is the most popular sport in my country. I play with my friends every Tuesday. We run a lot and score goals.\n\nMy brother prefers to swim in the municipal pool. Sport is good for health and for making friends. We are always active and fit."
  },
  {
    id: 16,
    title: "La Comida",
    text: "La comida española es famosa en todo el mundo. La paella tiene arroz, verduras y marisco. Es un plato con mucho sabor y color.\n\nTambién me gustan las tapas y la tortilla de patatas. Nosotros comemos tarde, a las dos de la tarde. La sobremesa es el tiempo para hablar después de comer.",
    translation: "Spanish food is famous all over the world. Paella has rice, vegetables, and seafood. It is a dish with a lot of flavor and color.\n\nI also like tapas and potato omelet. We eat late, at two in the afternoon. The 'sobremesa' is the time to talk after eating."
  },
  {
    id: 17,
    title: "El Animal",
    text: "El elefante es un animal muy grande y fuerte. Vive en África y tiene una trompa larga. Come plantas y bebe mucha agua.\n\nLos elefantes viven en grupos y son muy inteligentes. Es fascinante ver a estos animales en libertad. La naturaleza tiene seres vivos maravillosos.",
    translation: "The elephant is a very large and strong animal. It lives in Africa and has a long trunk. It eats plants and drinks a lot of water.\n\nElephants live in groups and are very intelligent. It is fascinating to see these animals in the wild. Nature has wonderful living beings."
  },
  {
    id: 18,
    title: "La Música",
    text: "La música es una parte importante de mi vida. Yo escucho canciones en español para aprender vocabulario. Mi cantante favorito es muy talentoso.\n\nYo toco la guitarra un poco por las tardes. La música me ayuda a relajarme y a estar contento. Hay muchos géneros musicales diferentes y bonitos.",
    translation: "Music is an important part of my life. I listen to songs in Spanish to learn vocabulary. My favorite singer is very talented.\n\nI play the guitar a little in the afternoons. Music helps me relax and be happy. There are many different and beautiful musical genres."
  },
  {
    id: 19,
    title: "El Viaje",
    text: "Mañana viajo a Madrid en tren de alta velocidad. El viaje dura tres horas y el paisaje es muy bonito. Llevo una maleta pequeña con mi ropa.\n\nEn Madrid, visito el Museo del Prado y el Parque del Retiro. Quiero conocer la capital y practicar mi español. Viajar es una experiencia inolvidable.",
    translation: "Tomorrow I travel to Madrid by high-speed train. The trip lasts three hours and the landscape is very beautiful. I carry a small suitcase with my clothes.\n\nIn Madrid, I visit the Prado Museum and the Retiro Park. I want to know the capital and practice my Spanish. Traveling is an unforgettable experience."
  },
  {
    id: 20,
    title: "El Hobby",
    text: "Mi hobby favorito es la fotografía de paisajes. Yo salgo al campo con mi cámara los domingos. Busco la luz perfecta para mis fotos.\n\nDespués, edito las imágenes en mi ordenador. Comparto mis fotos con mi familia y amigos. Tener un hobby es genial para expresar la creatividad.",
    translation: "My favorite hobby is landscape photography. I go out to the countryside with my camera on Sundays. I look for the perfect light for my photos.\n\nAfterwards, I edit the images on my computer. I share my photos with my family and friends. Having a hobby is great for expressing creativity."
  }
];
