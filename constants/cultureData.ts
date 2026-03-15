
export interface CultureQuestion {
  question: string;
  options: string[];
  answer: string;
}

export interface CultureCountry {
  id: string;
  name: string;
  title: string;
  text: string;
  translation: string;
  mostVisited: string;
  food: string;
  people: string;
  localWords: { word: string; meaning: string }[];
  questions: CultureQuestion[];
}

export const JAPANESE_CULTURE_DATA: CultureCountry[] = [
  {
    id: 'japan_intro',
    name: 'Japón',
    title: 'Japón: Tradición y Modernidad',
    text: "Japón es un país en Asia con una cultura única. 日本 (Nihon) es como se llama en japonés. La gente es muy respetuosa. El lugar más visitado es el Monte Fuji. Los japoneses comen mucho sushi y ramen. Para saludar dicen こんにちは (Konnichiwa).",
    translation: "Japan is a country in Asia with a unique culture. Nihon is how it's called in Japanese. People are very respectful. The most visited place is Mount Fuji. Japanese people eat a lot of sushi and ramen. To say hello they say Konnichiwa.",
    mostVisited: "Monte Fuji / Kioto",
    food: "Sushi, Ramen, Tempura",
    people: "Respetuosos, disciplinados y amables",
    localWords: [
      { word: "こんにちは (Konnichiwa)", meaning: "Hola" },
      { word: "ありがとう (Arigatou)", meaning: "Gracias" },
      { word: "すみません (Sumimasen)", meaning: "Perdón / Disculpe" }
    ],
    questions: [
      { question: "¿Cómo se dice Japón en japonés?", options: ["Nihon", "China", "Asia", "Tokyo"], answer: "Nihon" },
      { question: "¿Cuál es el lugar más visitado?", options: ["Monte Fuji", "Estatua de la Libertad", "Torre Eiffel", "Pirámides"], answer: "Monte Fuji" },
      { question: "¿Qué comen mucho en Japón?", options: ["Tacos", "Sushi", "Pizza", "Pasta"], answer: "Sushi" },
      { question: "¿Cómo se dice hola?", options: ["Konnichiwa", "Sayonara", "Arigatou", "Sumimasen"], answer: "Konnichiwa" },
      { question: "¿Cómo es la gente en Japón?", options: ["Respetuosa", "Grosera", "Ruidosa", "Perezosa"], answer: "Respetuosa" }
    ]
  },
  {
    id: 'tokyo',
    name: 'Tokio',
    title: 'Tokio: La Gran Metrópolis',
    text: "Tokio (東京 - Toukyou) es la capital de Japón. Es una ciudad llena de luces y tecnología. El cruce de Shibuya es el más famoso del mundo. En Tokio puedes ver templos antiguos junto a rascacielos modernos. La comida callejera es deliciosa.",
    translation: "Tokyo is the capital of Japan. It is a city full of lights and technology. Shibuya crossing is the most famous in the world. In Tokyo you can see ancient temples next to modern skyscrapers. Street food is delicious.",
    mostVisited: "Cruce de Shibuya / Torre de Tokio",
    food: "Takoyaki, Yakitori, Crepas",
    people: "Activos, modernos y organizados",
    localWords: [
      { word: "かわいい (Kawaii)", meaning: "Lindo / Tierno" },
      { word: "すごい (Sugoi)", meaning: "Increíble / Genial" },
      { word: "おいしい (Oishii)", meaning: "Delicioso" }
    ],
    questions: [
      { question: "¿Cuál es la capital de Japón?", options: ["Osaka", "Tokio", "Kioto", "Nara"], answer: "Tokio" },
      { question: "¿Qué cruce es famoso en Tokio?", options: ["Shibuya", "Times Square", "Piccadilly", "Reforma"], answer: "Shibuya" },
      { question: "¿Qué puedes ver en Tokio?", options: ["Templos y rascacielos", "Solo selva", "Solo desierto", "Solo nieve"], answer: "Templos y rascacielos" },
      { question: "¿Qué significa 'Kawaii'?", options: ["Lindo", "Feo", "Grande", "Pequeño"], answer: "Lindo" },
      { question: "¿Qué significa 'Sugoi'?", options: ["Increíble", "Malo", "Triste", "Aburrido"], answer: "Increíble" }
    ]
  }
];

export const CULTURE_DATA: CultureCountry[] = [
  {
    id: 'spain',
    name: 'España',
    title: 'España: Historia y Tapas',
    text: "España es un país en Europa con mucha historia. La gente es muy amable y alegre. En España, la comida es muy importante. Las 'tapas' son pequeñas porciones de comida que se comparten con amigos. El lugar más visitado es la Sagrada Familia en Barcelona. Los españoles hablan español, pero también catalán, gallego y vasco.",
    translation: "Spain is a country in Europe with a lot of history. The people are very friendly and cheerful. In Spain, food is very important. 'Tapas' are small portions of food shared with friends. The most visited place is the Sagrada Familia in Barcelona. Spaniards speak Spanish, but also Catalan, Galician, and Basque.",
    mostVisited: "La Sagrada Familia (Barcelona)",
    food: "Paella, Tapas, Tortilla de patatas",
    people: "Alegres, sociables y apasionados",
    localWords: [
      { word: "Vale", meaning: "Okay / Fine" },
      { word: "Guay", meaning: "Cool" },
      { word: "Tío/Tía", meaning: "Guy/Girl (informal)" }
    ],
    questions: [
      { question: "¿Dónde está España?", options: ["América", "Europa", "Asia", "África"], answer: "Europa" },
      { question: "¿Qué son las tapas?", options: ["Bebidas", "Postres", "Pequeñas porciones de comida", "Zapatos"], answer: "Pequeñas porciones de comida" },
      { question: "¿Cuál es el lugar más visitado?", options: ["El Prado", "La Sagrada Familia", "La Alhambra", "Ibiza"], answer: "La Sagrada Familia" },
      { question: "¿Cómo es la gente en España?", options: ["Seria", "Amable y alegre", "Triste", "Tímida"], answer: "Amable y alegre" },
      { question: "¿Qué idioma se habla además del español?", options: ["Francés", "Catalán", "Alemán", "Italiano"], answer: "Catalán" },
      { question: "¿Cuál es una comida típica?", options: ["Tacos", "Paella", "Sushi", "Pizza"], answer: "Paella" },
      { question: "¿Qué significa 'Vale'?", options: ["No", "Adiós", "Okay", "Gracias"], answer: "Okay" },
      { question: "¿Qué significa 'Guay'?", options: ["Malo", "Cool", "Caliente", "Frío"], answer: "Cool" },
      { question: "¿Cómo llaman informalmente a un amigo?", options: ["Señor", "Tío", "Maestro", "Jefe"], answer: "Tío" },
      { question: "¿España tiene mucha historia?", options: ["Sí", "No", "Un poco", "Nada"], answer: "Sí" }
    ]
  },
  {
    id: 'mexico',
    name: 'México',
    title: 'México: Colores y Tradiciones',
    text: "México es famoso por su cultura vibrante. La comida mexicana es Patrimonio de la Humanidad. Los tacos y el mole son deliciosos. El lugar más visitado es Chichén Itzá, una ciudad antigua de los Mayas. Los mexicanos son muy hospitalarios. Una palabra muy común es 'padre', que significa que algo es muy bueno o excelente.",
    translation: "Mexico is famous for its vibrant culture. Mexican food is World Heritage. Tacos and mole are delicious. The most visited place is Chichen Itza, an ancient Mayan city. Mexicans are very hospitable. A very common word is 'padre', which means that something is very good or excellent.",
    mostVisited: "Chichén Itzá (Yucatán)",
    food: "Tacos, Mole, Pozole",
    people: "Hospitalarios, trabajadores y festivos",
    localWords: [
      { word: "Padre", meaning: "Cool / Great" },
      { word: "Chamba", meaning: "Work" },
      { word: "Ahorita", meaning: "In a moment (can be never!)" }
    ],
    questions: [
      { question: "¿Por qué es famoso México?", options: ["Cultura vibrante", "Nieve", "Desiertos vacíos", "Frío"], answer: "Cultura vibrante" },
      { question: "¿Qué es Chichén Itzá?", options: ["Una playa", "Una ciudad antigua Maya", "Un restaurante", "Un museo moderno"], answer: "Una ciudad antigua Maya" },
      { question: "¿Cómo es la comida mexicana?", options: ["Aburrida", "Patrimonio de la Humanidad", "Solo picante", "Cara"], answer: "Patrimonio de la Humanidad" },
      { question: "¿Qué significa 'padre' en México?", options: ["Papá", "Algo excelente", "Triste", "Viejo"], answer: "Algo excelente" },
      { question: "¿Cómo son los mexicanos?", options: ["Hospitalarios", "Enojados", "Callados", "Fríos"], answer: "Hospitalarios" },
      { question: "¿Cuál es una comida mencionada?", options: ["Pasta", "Mole", "Hamburguesa", "Arroz"], answer: "Mole" },
      { question: "¿Qué significa 'chamba'?", options: ["Fiesta", "Trabajo", "Comida", "Sueño"], answer: "Trabajo" },
      { question: "¿Qué significa 'ahorita'?", options: ["Ayer", "En un momento", "Nunca", "Mañana"], answer: "En un momento" },
      { question: "¿México tiene mucha cultura?", options: ["Sí", "No", "Poca", "Nada"], answer: "Sí" },
      { question: "¿Los tacos son de México?", options: ["Sí", "No", "Tal vez", "De España"], answer: "Sí" }
    ]
  },
  {
    id: 'colombia',
    name: 'Colombia',
    title: 'Colombia: Café y Alegría',
    text: "Colombia es el país de las flores y el café. El café colombiano es el mejor del mundo. La gente es muy amable y siempre dice 'con gusto'. El lugar más visitado es Cartagena de Indias, una ciudad con murallas antiguas y playas hermosas. La comida típica es la 'bandeja paisa'. Los colombianos usan mucho la palabra 'bacano' para decir que algo es genial.",
    translation: "Colombia is the country of flowers and coffee. Colombian coffee is the best in the world. The people are very friendly and always say 'con gusto' (with pleasure). The most visited place is Cartagena de Indias, a city with ancient walls and beautiful beaches. The typical food is 'bandeja paisa'. Colombians use the word 'bacano' a lot to say that something is great.",
    mostVisited: "Cartagena de Indias",
    food: "Bandeja Paisa, Arepas, Café",
    people: "Amables, alegres y resilientes",
    localWords: [
      { word: "Bacano", meaning: "Cool / Great" },
      { word: "Parce", meaning: "Friend / Pal" },
      { word: "Tinto", meaning: "Black coffee" }
    ],
    questions: [
      { question: "¿De qué es el país Colombia?", options: ["Flores y café", "Petróleo", "Nieve", "Vino"], answer: "Flores y café" },
      { question: "¿Cómo es el café colombiano?", options: ["Malo", "El mejor del mundo", "Caro", "Amargo"], answer: "El mejor del mundo" },
      { question: "¿Qué dicen siempre los colombianos?", options: ["Hola", "Con gusto", "Adiós", "No sé"], answer: "Con gusto" },
      { question: "¿Cuál es el lugar más visitado?", options: ["Bogotá", "Cartagena de Indias", "Medellín", "Cali"], answer: "Cartagena de Indias" },
      { question: "¿Qué es la bandeja paisa?", options: ["Una bebida", "Comida típica", "Un baile", "Un sombrero"], answer: "Comida típica" },
      { question: "¿Qué significa 'bacano'?", options: ["Malo", "Genial", "Triste", "Grande"], answer: "Genial" },
      { question: "¿Qué significa 'parce'?", options: ["Enemigo", "Amigo", "Padre", "Hijo"], answer: "Amigo" },
      { question: "¿Qué es un 'tinto' en Colombia?", options: ["Vino", "Café negro", "Jugo", "Agua"], answer: "Café negro" },
      { question: "¿Cómo es la gente en Colombia?", options: ["Amable", "Seria", "Fría", "Distante"], answer: "Amable" },
      { question: "¿Cartagena tiene murallas?", options: ["Sí", "No", "Nuevas", "De madera"], answer: "Sí" }
    ]
  },
  {
    id: 'argentina',
    name: 'Argentina',
    title: 'Argentina: Tango y Asado',
    text: "Argentina es un país muy grande en el sur. Es famoso por el baile del Tango y el fútbol. El lugar más visitado son las Cataratas del Iguazú. La comida favorita es el 'asado' (carne a la parrilla). Los argentinos son muy apasionados. Ellos usan 'vos' en lugar de 'tú' y dicen 'che' para llamar la atención de alguien.",
    translation: "Argentina is a very large country in the south. It is famous for the Tango dance and soccer. The most visited place is the Iguazu Falls. The favorite food is 'asado' (grilled meat). Argentines are very passionate. They use 'vos' instead of 'tú' and say 'che' to get someone's attention.",
    mostVisited: "Cataratas del Iguazú",
    food: "Asado, Empanadas, Dulce de leche",
    people: "Apasionados, cultos y expresivos",
    localWords: [
      { word: "Che", meaning: "Hey / Friend" },
      { word: "Laburo", meaning: "Work" },
      { word: "Pibe/Piba", meaning: "Boy/Girl" }
    ],
    questions: [
      { question: "¿Dónde está Argentina?", options: ["Norte", "Sur", "Centro", "Europa"], answer: "Sur" },
      { question: "¿Por qué es famosa Argentina?", options: ["Tango y fútbol", "Salsa", "Béisbol", "Nieve"], answer: "Tango y fútbol" },
      { question: "¿Cuál es el lugar más visitado?", options: ["Buenos Aires", "Cataratas del Iguazú", "Mendoza", "Bariloche"], answer: "Cataratas del Iguazú" },
      { question: "¿Qué es el asado?", options: ["Pescado", "Carne a la parrilla", "Sopa", "Ensalada"], answer: "Carne a la parrilla" },
      { question: "¿Cómo son los argentinos?", options: ["Apasionados", "Fríos", "Tímidos", "Callados"], answer: "Apasionados" },
      { question: "¿Qué usan en lugar de 'tú'?", options: ["Usted", "Vos", "Nosotros", "Él"], answer: "Vos" },
      { question: "¿Qué significa 'che'?", options: ["Adiós", "Hey / Amigo", "Gracias", "No"], answer: "Hey / Amigo" },
      { question: "¿Qué significa 'laburo'?", options: ["Fiesta", "Trabajo", "Comida", "Viaje"], answer: "Trabajo" },
      { question: "¿Qué es un 'pibe'?", options: ["Un viejo", "Un chico", "Un perro", "Un gato"], answer: "Un chico" },
      { question: "¿Argentina es un país pequeño?", options: ["Sí", "No", "Muy pequeño", "Isla"], answer: "No" }
    ]
  },
  {
    id: 'chile',
    name: 'Chile',
    title: 'Chile: Naturaleza y Vino',
    text: "Chile es un país largo y estrecho entre las montañas y el mar. Tiene paisajes increíbles como el Desierto de Atacama y la Patagonia. El lugar más visitado es la Isla de Pascua con sus estatuas gigantes. Chile produce vino excelente. Los chilenos son amables y trabajadores. Una palabra muy chilena es 'bacán', que significa que algo es muy bueno.",
    translation: "Chile is a long and narrow country between the mountains and the sea. It has incredible landscapes like the Atacama Desert and Patagonia. The most visited place is Easter Island with its giant statues. Chile produces excellent wine. Chileans are friendly and hardworking. A very Chilean word is 'bacán', which means that something is very good.",
    mostVisited: "Isla de Pascua",
    food: "Empanadas de pino, Pastel de choclo, Vino",
    people: "Amables, solidarios y resilientes",
    localWords: [
      { word: "Bacán", meaning: "Cool / Great" },
      { word: "Fome", meaning: "Boring" },
      { word: "Pololo/Polola", meaning: "Boyfriend/Girlfriend" }
    ],
    questions: [
      { question: "¿Cómo es la forma de Chile?", options: ["Redondo", "Largo y estrecho", "Cuadrado", "Triangular"], answer: "Largo y estrecho" },
      { question: "¿Qué paisajes tiene Chile?", options: ["Solo selva", "Desierto y Patagonia", "Solo playas", "Solo ciudades"], answer: "Desierto y Patagonia" },
      { question: "¿Cuál es el lugar más visitado?", options: ["Santiago", "Isla de Pascua", "Valparaíso", "Viña del Mar"], answer: "Isla de Pascua" },
      { question: "¿Qué produce Chile con excelencia?", options: ["Cerveza", "Vino", "Té", "Leche"], answer: "Vino" },
      { question: "¿Cómo son los chilenos?", options: ["Amables y trabajadores", "Enojados", "Perezosos", "Tristes"], answer: "Amables y trabajadores" },
      { question: "¿Qué significa 'bacán'?", options: ["Malo", "Muy bueno", "Aburrido", "Viejo"], answer: "Muy bueno" },
      { question: "¿Qué significa 'fome'?", options: ["Divertido", "Aburrido", "Rápido", "Lento"], answer: "Aburrido" },
      { question: "¿Qué es un 'pololo'?", options: ["Un amigo", "Un novio", "Un hermano", "Un padre"], answer: "Un novio" },
      { question: "¿Dónde está Chile?", options: ["Entre montañas y mar", "En el centro de África", "En Europa", "En el Caribe"], answer: "Entre montañas y mar" },
      { question: "¿Isla de Pascua tiene estatuas?", options: ["Sí", "No", "Pequeñas", "De madera"], answer: "Sí" }
    ]
  },
  {
    id: 'dominican_republic',
    name: 'República Dominicana',
    title: 'República Dominicana: Playas y Merengue',
    text: "La República Dominicana es un paraíso en el Caribe. Es famosa por sus playas de arena blanca y agua azul. El lugar más visitado es Punta Cana. La música nacional es el Merengue y la Bachata. La comida típica es 'La Bandera' (arroz, habichuelas y carne). Los dominicanos son muy alegres y hospitalarios. Ellos dicen '¿Qué lo qué?' para saludar.",
    translation: "The Dominican Republic is a paradise in the Caribbean. It is famous for its white sand beaches and blue water. The most visited place is Punta Cana. The national music is Merengue and Bachata. The typical food is 'La Bandera' (rice, beans, and meat). Dominicans are very cheerful and hospitable. They say '¿Qué lo qué?' to say hello.",
    mostVisited: "Punta Cana",
    food: "La Bandera, Mangú, Sancocho",
    people: "Alegres, hospitalarios y rítmicos",
    localWords: [
      { word: "Qué lo qué", meaning: "What's up" },
      { word: "Vaina", meaning: "Thing / Stuff" },
      { word: "Colmado", meaning: "Small grocery store" }
    ],
    questions: [
      { question: "¿Dónde está la República Dominicana?", options: ["Europa", "Caribe", "Asia", "Suramérica"], answer: "Caribe" },
      { question: "¿Por qué es famosa?", options: ["Playas de arena blanca", "Nieve", "Desiertos", "Montañas de hielo"], answer: "Playas de arena blanca" },
      { question: "¿Cuál es el lugar más visitado?", options: ["Santo Domingo", "Punta Cana", "La Romana", "Santiago"], answer: "Punta Cana" },
      { question: "¿Cuál es la música nacional?", options: ["Salsa", "Merengue y Bachata", "Tango", "Rock"], answer: "Merengue y Bachata" },
      { question: "¿Qué es 'La Bandera'?", options: ["Un baile", "Comida típica", "Una canción", "Un deporte"], answer: "Comida típica" },
      { question: "¿Cómo son los dominicanos?", options: ["Alegres y hospitalarios", "Serios", "Tristes", "Callados"], answer: "Alegres y hospitalarios" },
      { question: "¿Qué dicen para saludar?", options: ["Hola", "¿Qué lo qué?", "Adiós", "Buenos días"], answer: "¿Qué lo qué?" },
      { question: "¿Qué significa 'vaina'?", options: ["Comida", "Cosa / Algo", "Persona", "Lugar"], answer: "Cosa / Algo" },
      { question: "¿Qué es un 'colmado'?", options: ["Una playa", "Una tienda pequeña", "Un hotel", "Un cine"], answer: "Una tienda pequeña" },
      { question: "¿El agua es azul en sus playas?", options: ["Sí", "No", "Verde", "Negra"], answer: "Sí" }
    ]
  },
  {
    id: 'peru',
    name: 'Perú',
    title: 'Perú: Historia Inca y Gastronomía',
    text: "Perú es famoso por su increíble historia y su comida. El lugar más visitado es Machu Picchu, una ciudad antigua de los Incas en las montañas. La comida peruana es considerada una de las mejores del mundo, especialmente el 'ceviche'. Los peruanos son muy orgullosos de su cultura. Una palabra común es 'chévere', que significa que algo es muy bueno o genial.",
    translation: "Peru is famous for its incredible history and its food. The most visited place is Machu Picchu, an ancient Inca city in the mountains. Peruvian food is considered one of the best in the world, especially 'ceviche'. Peruvians are very proud of their culture. A common word is 'chévere', which means that something is very good or great.",
    mostVisited: "Machu Picchu (Cusco)",
    food: "Ceviche, Lomo Saltado, Ají de Gallina",
    people: "Orgullosos, amables y creativos",
    localWords: [
      { word: "Chévere", meaning: "Cool / Great" },
      { word: "Pata", meaning: "Friend / Buddy" },
      { word: "Chamba", meaning: "Work" }
    ],
    questions: [
      { question: "¿Por qué es famoso Perú?", options: ["Historia y comida", "Nieve", "Desiertos vacíos", "Frío"], answer: "Historia y comida" },
      { question: "¿Qué es Machu Picchu?", options: ["Una playa", "Una ciudad antigua Inca", "Un restaurante", "Un museo moderno"], answer: "Una ciudad antigua Inca" },
      { question: "¿Cómo es la comida peruana?", options: ["Aburrida", "Una de las mejores del mundo", "Solo picante", "Cara"], answer: "Una de las mejores del mundo" },
      { question: "¿Qué significa 'chévere' en Perú?", options: ["Malo", "Algo genial", "Triste", "Viejo"], answer: "Algo genial" },
      { question: "¿Cómo son los peruanos?", options: ["Orgullosos", "Enojados", "Callados", "Fríos"], answer: "Orgullosos" },
      { question: "¿Cuál es una comida típica?", options: ["Tacos", "Ceviche", "Sushi", "Pizza"], answer: "Ceviche" },
      { question: "¿Qué significa 'pata'?", options: ["Pie", "Amigo", "Comida", "Sueño"], answer: "Amigo" },
      { question: "¿Qué significa 'chamba'?", options: ["Fiesta", "Trabajo", "Comida", "Sueño"], answer: "Trabajo" },
      { question: "¿Perú tiene mucha historia?", options: ["Sí", "No", "Poca", "Nada"], answer: "Sí" },
      { question: "¿Machu Picchu está en las montañas?", options: ["Sí", "No", "En la playa", "En el desierto"], answer: "Sí" }
    ]
  },
  {
    id: 'costa_rica',
    name: 'Costa Rica',
    title: 'Costa Rica: Pura Vida y Naturaleza',
    text: "Costa Rica es conocida por su lema 'Pura Vida', que refleja su estilo de vida relajado y feliz. Es un país líder en ecoturismo, con muchos volcanes y selvas. El lugar más visitado es el Parque Nacional Manuel Antonio. La comida típica es el 'gallo pinto' (arroz y frijoles). Los costarricenses, llamados 'ticos', son muy amigables y cuidan mucho el medio ambiente.",
    translation: "Costa Rica is known for its motto 'Pura Vida', which reflects its relaxed and happy lifestyle. It is a leading country in ecotourism, with many volcanoes and jungles. The most visited place is Manuel Antonio National Park. The typical food is 'gallo pinto' (rice and beans). Costa Ricans, called 'ticos', are very friendly and take great care of the environment.",
    mostVisited: "Parque Nacional Manuel Antonio",
    food: "Gallo Pinto, Casado, Café",
    people: "Pacíficos, amigables y ecológicos",
    localWords: [
      { word: "Pura Vida", meaning: "Everything's good / Hello / Goodbye" },
      { word: "Tico/Tica", meaning: "Costa Rican person" },
      { word: "Tuanis", meaning: "Cool / Nice" }
    ],
    questions: [
      { question: "¿Cuál es el lema de Costa Rica?", options: ["Pura Vida", "Viva México", "Vale", "Che"], answer: "Pura Vida" },
      { question: "¿En qué es líder Costa Rica?", options: ["Ecoturismo", "Minería", "Moda", "Tecnología espacial"], answer: "Ecoturismo" },
      { question: "¿Cuál es el lugar más visitado?", options: ["San José", "Manuel Antonio", "Arenal", "Tamarindo"], answer: "Manuel Antonio" },
      { question: "¿Qué es el gallo pinto?", options: ["Un animal", "Arroz y frijoles", "Un baile", "Un sombrero"], answer: "Arroz y frijoles" },
      { question: "¿Cómo llaman a los costarricenses?", options: ["Ticos", "Gauchos", "Chamos", "Pibes"], answer: "Ticos" },
      { question: "¿Qué significa 'tuanis'?", options: ["Malo", "Cool", "Triste", "Grande"], answer: "Cool" },
      { question: "¿Costa Rica tiene volcanes?", options: ["Sí", "No", "Solo uno", "Extintos"], answer: "Sí" },
      { question: "¿Cómo es el estilo de vida?", options: ["Estresado", "Relajado y feliz", "Triste", "Aburrido"], answer: "Relajado y feliz" },
      { question: "¿Cuidan el medio ambiente?", options: ["Sí", "No", "Un poco", "Nada"], answer: "Sí" },
      { question: "¿Qué significa 'Pura Vida'?", options: ["Solo comida", "Todo bien / Hola", "Adiós para siempre", "Tengo hambre"], answer: "Todo bien / Hola" }
    ]
  },
  {
    id: 'puerto_rico',
    name: 'Puerto Rico',
    title: 'Puerto Rico: La Isla del Encanto',
    text: "Puerto Rico es una isla hermosa en el Caribe. Es famosa por su música, especialmente la salsa y el reguetón. El lugar más visitado es el Viejo San Juan, con sus calles de adoquines azules. La comida típica es el 'mofongo' (plátano frito machacado). Los puertorriqueños son muy alegres y orgullosos de su herencia. Una palabra común es 'brutal', para decir que algo es increíble.",
    translation: "Puerto Rico is a beautiful island in the Caribbean. It is famous for its music, especially salsa and reggaeton. The most visited place is Old San Juan, with its blue cobblestone streets. The typical food is 'mofongo' (mashed fried plantains). Puerto Ricans are very cheerful and proud of their heritage. A common word is 'brutal', to say that something is incredible.",
    mostVisited: "Viejo San Juan",
    food: "Mofongo, Arroz con gandules, Alcapurrias",
    people: "Alegres, orgullosos y hospitalarios",
    localWords: [
      { word: "Brutal", meaning: "Awesome / Incredible" },
      { word: "Boricua", meaning: "Puerto Rican person" },
      { word: "Wepa", meaning: "Expression of joy" }
    ],
    questions: [
      { question: "¿Cómo llaman a Puerto Rico?", options: ["La Isla del Encanto", "El Continente", "La Montaña", "El Desierto"], answer: "La Isla del Encanto" },
      { question: "¿Por qué música es famosa?", options: ["Salsa y reguetón", "Tango", "Rock", "Jazz"], answer: "Salsa y reguetón" },
      { question: "¿Qué hay en el Viejo San Juan?", options: ["Adoquines azules", "Nieve", "Pirámides", "Rascacielos"], answer: "Adoquines azules" },
      { question: "¿Qué es el mofongo?", options: ["Una bebida", "Plátano frito machacado", "Un postre", "Un deporte"], answer: "Plátano frito machacado" },
      { question: "¿Cómo llaman a los puertorriqueños?", options: ["Boricuas", "Ticos", "Gauchos", "Pibes"], answer: "Boricuas" },
      { question: "¿Qué significa 'brutal'?", options: ["Malo", "Increíble", "Violento", "Triste"], answer: "Increíble" },
      { question: "¿Qué es 'Wepa'?", options: ["Un insulto", "Expresión de alegría", "Una comida", "Un lugar"], answer: "Expresión de alegría" },
      { question: "¿Puerto Rico es una isla?", options: ["Sí", "No", "Un desierto", "Una montaña"], answer: "Sí" },
      { question: "¿Cómo es la gente?", options: ["Alegre", "Seria", "Fría", "Distante"], answer: "Alegre" },
      { question: "¿Dónde está Puerto Rico?", options: ["Europa", "Caribe", "Asia", "África"], answer: "Caribe" }
    ]
  },
  {
    id: 'guatemala',
    name: 'Guatemala',
    title: 'Guatemala: El Corazón del Mundo Maya',
    text: "Guatemala es un país con una herencia maya muy fuerte. Es famoso por sus volcanes y lagos hermosos, como el Lago de Atitlán. El lugar más visitado es Tikal, una ciudad maya gigante en la selva. La comida típica es el 'pepián' (un guiso tradicional). Los guatemaltecos son amables y conservan muchas tradiciones antiguas. Una palabra común es 'chilero', que significa que algo es bonito o bueno.",
    translation: "Guatemala is a country with a very strong Mayan heritage. It is famous for its volcanoes and beautiful lakes, such as Lake Atitlan. The most visited place is Tikal, a giant Mayan city in the jungle. The typical food is 'pepian' (a traditional stew). Guatemalans are friendly and preserve many ancient traditions. A common word is 'chilero', which means that something is pretty or good.",
    mostVisited: "Tikal (Petén)",
    food: "Pepián, Kak'ik, Tamales",
    people: "Amables, tradicionales y trabajadores",
    localWords: [
      { word: "Chilero", meaning: "Cool / Nice" },
      { word: "Patojo/a", meaning: "Kid / Child" },
      { word: "Chapín/Chapina", meaning: "Guatemalan person" }
    ],
    questions: [
      { question: "¿De qué cultura tiene herencia Guatemala?", options: ["Maya", "Inca", "Azteca", "Romana"], answer: "Maya" },
      { question: "¿Qué lago es famoso en Guatemala?", options: ["Atitlán", "Titicaca", "Michigan", "Loch Ness"], answer: "Atitlán" },
      { question: "¿Qué es Tikal?", options: ["Una ciudad maya", "Un volcán", "Un río", "Una playa"], answer: "Una ciudad maya" },
      { question: "¿Qué es el pepián?", options: ["Un guiso tradicional", "Un postre", "Una bebida", "Un baile"], answer: "Un guiso tradicional" },
      { question: "¿Cómo llaman a los guatemaltecos?", options: ["Chapines", "Ticos", "Boricuas", "Gauchos"], answer: "Chapines" },
      { question: "¿Qué significa 'chilero'?", options: ["Malo", "Bonito / Bueno", "Picante", "Frío"], answer: "Bonito / Bueno" },
      { question: "¿Qué es un 'patojo'?", options: ["Un pato", "Un niño", "Un anciano", "Un perro"], answer: "Un niño" },
      { question: "¿Guatemala tiene volcanes?", options: ["Sí", "No", "Solo uno", "Extintos"], answer: "Sí" },
      { question: "¿Cómo es la gente?", options: ["Amable", "Enojada", "Fría", "Distante"], answer: "Amable" },
      { question: "¿Tikal está en la selva?", options: ["Sí", "No", "En el desierto", "En la ciudad"], answer: "Sí" }
    ]
  },
  {
    id: 'uruguay',
    name: 'Uruguay',
    title: 'Uruguay: Mate y Tranquilidad',
    text: "Uruguay es un país pequeño y tranquilo en el sur de América. Es famoso por sus playas, como Punta del Este, y por su amor al fútbol. Los uruguayos beben 'mate' todo el día, que es una infusión de hierbas. La comida favorita es el 'asado'. La gente es muy educada y relajada. Ellos también usan 'vos' y dicen 'ta' para decir que están de acuerdo con algo.",
    translation: "Uruguay is a small and quiet country in South America. It is famous for its beaches, such as Punta del Este, and for its love of soccer. Uruguayans drink 'mate' all day, which is an herbal infusion. The favorite food is 'asado'. The people are very polite and relaxed. They also use 'vos' and say 'ta' to say they agree with something.",
    mostVisited: "Punta del Este",
    food: "Asado, Chivito, Mate",
    people: "Educados, relajados y hospitalarios",
    localWords: [
      { word: "Ta", meaning: "Okay / I agree" },
      { word: "Gurí/Gurisa", meaning: "Boy/Girl" },
      { word: "Bo", meaning: "Hey / Friend (informal)" }
    ],
    questions: [
      { question: "¿Cómo es Uruguay?", options: ["Pequeño y tranquilo", "Gigante y ruidoso", "Solo desierto", "Solo selva"], answer: "Pequeño y tranquilo" },
      { question: "¿Qué beben los uruguayos todo el día?", options: ["Mate", "Café", "Té", "Jugo"], answer: "Mate" },
      { question: "¿Qué es el mate?", options: ["Una infusión de hierbas", "Una sopa", "Un postre", "Una carne"], answer: "Una infusión de hierbas" },
      { question: "¿Cuál es una playa famosa?", options: ["Punta del Este", "Cancún", "Copacabana", "Miami"], answer: "Punta del Este" },
      { question: "¿Qué significa 'ta'?", options: ["No", "Okay / De acuerdo", "Adiós", "Gracias"], answer: "Okay / De acuerdo" },
      { question: "¿Qué es un 'gurí'?", options: ["Un niño", "Un viejo", "Un perro", "Un gato"], answer: "Un niño" },
      { question: "¿Qué usan en lugar de 'tú'?", options: ["Usted", "Vos", "Nosotros", "Él"], answer: "Vos" },
      { question: "¿Cómo es la gente?", options: ["Educada y relajada", "Enojada", "Ruidosa", "Perezosa"], answer: "Educada y relajada" },
      { question: "¿Uruguay ama el fútbol?", options: ["Sí", "No", "Un poco", "Nada"], answer: "Sí" },
      { question: "¿Qué es el chivito?", options: ["Un sándwich típico", "Un baile", "Un sombrero", "Un río"], answer: "Un sándwich típico" }
    ]
  },
  {
    id: 'ecuador',
    name: 'Ecuador',
    title: 'Ecuador: Mitad del Mundo y Galápagos',
    text: "Ecuador es un país pequeño pero con una biodiversidad increíble. Es famoso por las Islas Galápagos, donde Charles Darwin estudió la evolución. También tiene el monumento a la 'Mitad del Mundo', donde puedes estar en los dos hemisferios al mismo tiempo. La comida típica incluye el 'encebollado' (sopa de pescado). Los ecuatorianos son amables y su cultura está influenciada por los Andes y la costa.",
    translation: "Ecuador is a small country but with incredible biodiversity. It is famous for the Galapagos Islands, where Charles Darwin studied evolution. It also has the 'Middle of the World' monument, where you can stand in both hemispheres at the same time. Typical food includes 'encebollado' (fish soup). Ecuadorians are friendly and their culture is influenced by the Andes and the coast.",
    mostVisited: "Islas Galápagos",
    food: "Encebollado, Ceviche de camarón, Cuy",
    people: "Amables, diversos y hospitalarios",
    localWords: [
      { word: "Chévere", meaning: "Cool / Great" },
      { word: "Chapa", meaning: "Police officer" },
      { word: "Mande", meaning: "Excuse me? / What?" }
    ],
    questions: [
      { question: "¿Por qué es famoso Ecuador?", options: ["Islas Galápagos", "Nieve", "Desiertos", "Canguros"], answer: "Islas Galápagos" },
      { question: "¿Qué monumento famoso tiene?", options: ["Mitad del Mundo", "Torre Eiffel", "Estatua de la Libertad", "Big Ben"], answer: "Mitad del Mundo" },
      { question: "¿Qué puedes hacer en la Mitad del Mundo?", options: ["Estar en dos hemisferios", "Esquiar", "Nadar con tiburones", "Volar"], answer: "Estar en dos hemisferios" },
      { question: "¿Quién estudió en las Galápagos?", options: ["Charles Darwin", "Einstein", "Newton", "Picasso"], answer: "Charles Darwin" },
      { question: "¿Qué es el encebollado?", options: ["Una sopa de pescado", "Un postre", "Un baile", "Un sombrero"], answer: "Una sopa de pescado" },
      { question: "¿Qué significa 'chévere'?", options: ["Malo", "Genial", "Triste", "Grande"], answer: "Genial" },
      { question: "¿Ecuador tiene mucha biodiversidad?", options: ["Sí", "No", "Poca", "Nada"], answer: "Sí" },
      { question: "¿Cómo es la gente?", options: ["Amable", "Enojada", "Fría", "Distante"], answer: "Amable" },
      { question: "¿Qué es el 'mande'?", options: ["Una forma de preguntar '¿qué?'", "Un insulto", "Una comida", "Un lugar"], answer: "Una forma de preguntar '¿qué?'" },
      { question: "¿Dónde está Ecuador?", options: ["Suramérica", "Europa", "Asia", "África"], answer: "Suramérica" }
    ]
  },
  {
    id: 'venezuela',
    name: 'Venezuela',
    title: 'Venezuela: Paisajes y Arepas',
    text: "Venezuela es un país con paisajes naturales impresionantes, como el Salto Ángel, la cascada más alta del mundo. Es famoso por su comida, especialmente la 'arepa', que se come a cualquier hora. Los venezolanos son muy sociables, alegres y les encanta la música. Una palabra muy común es 'pana', que significa amigo. También dicen 'chévere' para decir que todo está bien.",
    translation: "Venezuela is a country with impressive natural landscapes, such as Angel Falls, the highest waterfall in the world. It is famous for its food, especially the 'arepa', which is eaten at any time. Venezuelans are very sociable, cheerful and love music. A very common word is 'pana', which means friend. They also say 'chévere' to say that everything is fine.",
    mostVisited: "Salto Ángel (Canaima)",
    food: "Arepas, Pabellón Criollo, Cachapas",
    people: "Sociables, alegres y hospitalarios",
    localWords: [
      { word: "Pana", meaning: "Friend / Buddy" },
      { word: "Chévere", meaning: "Cool / Great" },
      { word: "Chamo/Chama", meaning: "Boy/Girl" }
    ],
    questions: [
      { question: "¿Cuál es la cascada más alta del mundo?", options: ["Salto Ángel", "Niágara", "Iguazú", "Victoria"], answer: "Salto Ángel" },
      { question: "¿Cuál es la comida más famosa?", options: ["Arepa", "Taco", "Pizza", "Sushi"], answer: "Arepa" },
      { question: "¿Qué significa 'pana'?", options: ["Enemigo", "Amigo", "Padre", "Hijo"], answer: "Amigo" },
      { question: "¿Cómo son los venezolanos?", options: ["Sociables y alegres", "Serios", "Tristes", "Callados"], answer: "Sociables y alegres" },
      { question: "¿Qué significa 'chévere'?", options: ["Malo", "Todo bien / Genial", "Triste", "Grande"], answer: "Todo bien / Genial" },
      { question: "¿Qué es un 'chamo'?", options: ["Un niño/joven", "Un viejo", "Un perro", "Un gato"], answer: "Un niño/joven" },
      { question: "¿Dónde está el Salto Ángel?", options: ["Canaima", "Caracas", "Maracaibo", "Valencia"], answer: "Canaima" },
      { question: "¿Venezuela tiene paisajes naturales?", options: ["Sí", "No", "Solo ciudades", "Solo desierto"], answer: "Sí" },
      { question: "¿La arepa se come a cualquier hora?", options: ["Sí", "No", "Solo en la mañana", "Solo en la noche"], answer: "Sí" },
      { question: "¿Qué es el pabellón criollo?", options: ["Plato nacional", "Un baile", "Un sombrero", "Un río"], answer: "Plato nacional" }
    ]
  },
  {
    id: 'cuba',
    name: 'Cuba',
    title: 'Cuba: Música y Autos Clásicos',
    text: "Cuba es la isla más grande del Caribe. Es famosa por su música (son, salsa), sus autos clásicos de los años 50 y su historia. La Habana es su capital y tiene calles llenas de color. La comida típica es 'arroz con frijoles' y 'ropa vieja'. Los cubanos son muy conversadores, alegres y tienen un fuerte sentido de comunidad. Ellos dicen '¿Qué bolá?' para saludar.",
    translation: "Cuba is the largest island in the Caribbean. It is famous for its music (son, salsa), its classic cars from the 50s and its history. Havana is its capital and has streets full of color. Typical food is 'rice and beans' and 'ropa vieja'. Cubans are very talkative, cheerful and have a strong sense of community. They say '¿Qué bolá?' to say hello.",
    mostVisited: "La Habana Vieja",
    food: "Ropa Vieja, Arroz con frijoles, Sándwich cubano",
    people: "Conversadores, alegres y resilientes",
    localWords: [
      { word: "Qué bolá", meaning: "What's up" },
      { word: "Asere", meaning: "Friend / Buddy" },
      { word: "Guagua", meaning: "Bus" }
    ],
    questions: [
      { question: "¿Cuál es la isla más grande del Caribe?", options: ["Cuba", "Jamaica", "Puerto Rico", "Haití"], answer: "Cuba" },
      { question: "¿Por qué es famosa Cuba?", options: ["Música y autos clásicos", "Nieve", "Desiertos", "Tecnología"], answer: "Música y autos clásicos" },
      { question: "¿Cuál es la capital?", options: ["La Habana", "Santiago", "Varadero", "Trinidad"], answer: "La Habana" },
      { question: "¿Qué significa '¿Qué bolá?'?", options: ["Adiós", "¿Qué pasa? / Hola", "Gracias", "No"], answer: "¿Qué pasa? / Hola" },
      { question: "¿Qué es la 'ropa vieja'?", options: ["Ropa usada", "Comida típica", "Un baile", "Un sombrero"], answer: "Comida típica" },
      { question: "¿Cómo son los cubanos?", options: ["Conversadores y alegres", "Serios", "Tristes", "Callados"], answer: "Conversadores y alegres" },
      { question: "¿Qué significa 'asere'?", options: ["Enemigo", "Amigo", "Padre", "Hijo"], answer: "Amigo" },
      { question: "¿Qué es una 'guagua'?", options: ["Un bebé", "Un autobús", "Un perro", "Un gato"], answer: "Un autobús" },
      { question: "¿Cuba tiene autos clásicos?", options: ["Sí", "No", "Solo nuevos", "De madera"], answer: "Sí" },
      { question: "¿Dónde está Cuba?", options: ["Caribe", "Europa", "Asia", "África"], answer: "Caribe" }
    ]
  },
  {
    id: 'panama',
    name: 'Panamá',
    title: 'Panamá: El Canal y la Modernidad',
    text: "Panamá es famoso por su Canal, que une el Océano Atlántico con el Pacífico. Es un centro importante para el comercio mundial. Ciudad de Panamá tiene rascacielos modernos y un casco antiguo histórico. La comida típica es el 'sancocho' (sopa de pollo). Los panameños son diversos y hospitalarios. Una palabra común es 'fren', que viene del inglés 'friend' y significa amigo.",
    translation: "Panama is famous for its Canal, which joins the Atlantic Ocean with the Pacific. It is an important center for world trade. Panama City has modern skyscrapers and a historic old town. Typical food is 'sancocho' (chicken soup). Panamanians are diverse and hospitable. A common word is 'fren', which comes from the English 'friend' and means friend.",
    mostVisited: "Canal de Panamá",
    food: "Sancocho, Arroz con pollo, Patacones",
    people: "Diversos, hospitalarios y trabajadores",
    localWords: [
      { word: "Fren", meaning: "Friend" },
      { word: "Chévere", meaning: "Cool / Great" },
      { word: "Paviarse", meaning: "To skip school/work" }
    ],
    questions: [
      { question: "¿Por qué es famoso Panamá?", options: ["El Canal", "Nieve", "Pirámides", "Canguros"], answer: "El Canal" },
      { question: "¿Qué océanos une el Canal?", options: ["Atlántico y Pacífico", "Índico y Ártico", "Antártico e Índico", "Ninguno"], answer: "Atlántico y Pacífico" },
      { question: "¿Cómo es la Ciudad de Panamá?", options: ["Moderna con rascacielos", "Solo ruinas", "Solo selva", "Solo desierto"], answer: "Moderna con rascacielos" },
      { question: "¿Qué es el sancocho?", options: ["Una sopa de pollo", "Un postre", "Un baile", "Un sombrero"], answer: "Una sopa de pollo" },
      { question: "¿Qué significa 'fren'?", options: ["Enemigo", "Amigo", "Padre", "Hijo"], answer: "Amigo" },
      { question: "¿Cómo son los panameños?", options: ["Diversos y hospitalarios", "Enojados", "Callados", "Fríos"], answer: "Diversos y hospitalarios" },
      { question: "¿Qué significa 'paviarse'?", options: ["Trabajar mucho", "Faltar a clase/trabajo", "Comer", "Dormir"], answer: "Faltar a clase/trabajo" },
      { question: "¿Panamá es importante para el comercio?", options: ["Sí", "No", "Un poco", "Nada"], answer: "Sí" },
      { question: "¿Qué son los patacones?", options: ["Plátano frito", "Un pez", "Un pájaro", "Una flor"], answer: "Plátano frito" },
      { question: "¿Dónde está Panamá?", options: ["Centroamérica", "Europa", "Asia", "África"], answer: "Centroamérica" }
    ]
  }
];
