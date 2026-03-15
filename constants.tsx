
import { Module, VideoLesson, Teacher } from './types';

export const MODULES: Module[] = [
  { 
    id: 1, 
    title: 'Module 1: Introduce Yourself & Greetings', 
    description: 'This module covers fundamental Spanish for self-introduction and basic interactions. Learn essential phrases to greet others, count from 1 to 20, present yourself, understand simple questions, and master the foundational verb "Ser" (to be) for identity and origin.', 
    topics: ['Greetings & Farewells', 'Numbers 1-20', 'Self-Introduction (Name, Origin, Age)', 'Basic Questions "¿Cómo te llamas?"', 'The verb "Ser" (identity, origin)']
  },
  { 
    id: 2, 
    title: 'Module 2: The City & Family', 
    description: 'Explore vocabulary related to the city and family. Learn to describe places, ask for things, introduce family members, count up to 100, and master the Spanish alphabet for spelling. Focus on basic conversational phrases for everyday situations.', 
    topics: ['City Vocabulary (places, asking for things)', 'Family Members', 'Numbers 1-100', 'The Spanish Alphabet & Spelling', 'Classroom Phrases'] 
  },
  { 
    id: 3, 
    title: 'Module 3: Directions & Food', 
    description: 'Navigate Spanish cities and restaurant menus. This module teaches how to ask for and give directions, order food, express likes and dislikes using "Gustar," understand location with "Estar," and conjugate regular -AR verbs for daily actions.', 
    topics: ['Giving & Asking Directions', 'Food & Restaurant Vocabulary', 'The verb "Gustar" (to like)', 'The verb "Estar" (location, temporary state)', 'Regular -AR verbs (e.g., hablar, comer, vivir)'] 
  },
  { 
    id: 4, 
    title: 'Module 4: Travel & Shopping', 
    description: 'Prepare for travel and shopping in Spanish-speaking countries. Learn airport and clothing vocabulary, master definite and indefinite articles, and conjugate regular -ER and -IR verbs. Understand how to describe items and use common idiomatic expressions.', 
    topics: ['Airport & Travel Vocabulary', 'Clothing & Shopping Phrases', 'Definite & Indefinite Articles (el/la/los/las, un/una/unos/unas)', 'Regular -ER & -IR verbs', 'The verb "Tener" (to have) & Idiomatic Expressions'] 
  },
  { 
    id: 5, 
    title: 'Module 5: At the Hospital & Body Parts', 
    description: 'Discuss health and body parts. This module focuses on human anatomy, common diseases, hospital-related vocabulary, and how to express pain using the verb "Doler." Learn to communicate effectively with medical professionals in Spanish.', 
    topics: ['Human Body (organs, skeleton, parts)', 'Common Diseases & Injuries', 'Hospital & Medical Vocabulary', 'The verb "Doler" (to hurt)', 'Talking to the Doctor'] 
  }
];

const generateVideos = () => {
  const videos: VideoLesson[] = [];
  
  // YouTube IDs verified for Spanish topics
  const youtubeIds: Record<number, string[]> = {
    1: [
      'k5_zRzX7iDs', // Clase 1 palabras internacionales
      'E5e5IWWpo4I', // Clase 2: los saludos
      'HuAPlgl3kT4', // Clase 3 Palabras básicas
      'jKerSQjGO88', // Clase 4 los números hasta el 10
      'kWeVof35Clg', // Clase 5 los números hasta el 20
      'HuAPlgl3kT4', // Clase 6 presentarse (preguntas)
      'D5t0myrY6dI', // Clase 7 presentarse en español respuestas
      '0LgHQVenMgw', // Clase 8 pronombres personales
      '0LgHQVenMgw', // Clase 9 el verbo ser
      'LfsHRi9WRLQ'  // Clase 10 frases con el verbo ser
    ],
    2: [
      'Va2_uzWuW4c', // Clase 1 en la ciudad
      '_2x5sicLKKA', // Clase 2 en la ciudad 2
      'B1ZtK_2uq0A', // Clase 3 en la ciudad preguntas
      'uebrDTFIO3w', // Clase 4 frases en la clase
      'iqkd98tp5hk', // Clase 5 los números hasta el 100
      'qYpS6tG0m0o', // Clase 6 (reuse old ID for placeholder)
      'iAa3PHJGh7A', // Clase 7 los colores
      'Kw5VmkBH2PQ', // Clase 8 los días de la semana
      'b_Ksh7A2hS8', // Clase 9 (reuse old ID for placeholder)
      'UcyMtzsIFrc'  // Clase 10 el abecedario (prioritized over verb to be)
    ],
    3: [ // New IDs for Module 3 - 11 videos
      'sgo6-ctxDOo', // Clase 1 los alimentos 
      'n9T9P8hFwV0', // Clase 2 el restaurante 
      'Ro1iGtdyvWY', // Clase 3 el restaurante 
      'pYq_LkXg8Vk', // Clase 4 dar direcciones 
      'npleWq6TtZo', // Clase 5 dar direcciones
      '8TxSLvycEC0', // Clase 6 verbo gustar 
      'V-FaEUFEUmA', // Clase 7 verbo gustar frases 
      'PotV8jf_xVk', // Clase 8 verbo estar 
      'F-hnq_eEB_4', // Clase 9 frases con el verbo estar 
      'JcGFCZXiD5I', // Clase 10 verbos regulares ar 
      'VLq_-2ScPI0'  // Clase 11 frases verbos regulares ar
    ],
    4: [ // New IDs for Module 4 - 11 videos
      'g6DHjWuv8FA', // Clase 1 en el aeropuerto 1 
      'nc-RB-Lks-c', // Clase 2 en el aeropuerto 2
      'HBAPHYSXXP0', // Clase 3 la ropa 1
      'TJwxgJ295k8', // Clase 4 la ropa 2 
      'vXNqSw5xdEM', // Clase 5 verbo tener 
      'LWakhyD6exw', // Clase 6 expresiones con el verbo tener
      '8nvrVrmykDY', // Clase 7 artículo definido
      'N9qN7Us5Q0w', // Clase 8 artículo indefinido
      'Ly403zchOGU', // Clase 9 el plural
      'Zv3dbbGIoMY', // Clase 10 verbos regulares er 
      '_D3MMwsr28Q'  // Clase 11 verbos regulares ir
    ],
    5: [ // New IDs for Module 5 - 10 videos
      '-FuOVMlkAQ0', // Clase 1 el cuerpo humano
      'JMvBRuLUiag', // Clase 2 enfermedades
      '_B0ZZyAd9mw', // Clase 3 primeros auxilios
      '0OfD0TWI57I', // Clase 4 lesiones
      'twpxbC-JYYs', // Clase 5 en el hospital 
      'NhkxmOAvlN0', // Clase 6 los músculos 
      'iN4_RwkG19E', // Clase 7 decir que te duele 
      'LtQ-EzmY0_o', // Clase 8 verbo doler 
      'Ts0MQIyPg1U', // Clase 9 los órganos 
      '1xlDbL9v3dc'  // Clase 10 ejercicios extras
    ]
  };

  const module1Titles = [
    'International words',
    'Greetings',
    'Basic words',
    'Numbers up to 10',
    'Numbers up to 20',
    'Introduce yourself (questions)',
    'Introduce yourself in Spanish (answers)',
    'Personal pronouns',
    'The verb "Ser"',
    'Phrases with the verb "Ser"'
  ];

  const module2Titles = [
    'In the city 1',
    'In the city 2',
    'In the city (questions)',
    'Phrases in class',
    'Numbers up to 100',
    'Class 6 (Pending)', // Placeholder title
    'The colors',
    'Days of the week',
    'Class 9 (Pending)', // Placeholder title
    'The alphabet'
  ];

  const module3Titles = [ // New titles for Module 3
    'Class 1: Food',
    'Class 2: The restaurant',
    'Class 3: The restaurant (phrases)',
    'Class 4: Giving directions',
    'Class 5: Giving directions (phrases)',
    'Class 6: Verb "Gustar"',
    'Class 7: Phrases with verb "Gustar"',
    'Class 8: Verb "Estar"',
    'Class 9: Phrases with verb "Estar"',
    'Class 10: Regular -AR verbs',
    'Class 11: Phrases with regular -AR verbs'
  ];

  const module4Titles = [ // New titles for Module 4
    'Class 1: At the airport 1',
    'Class 2: At the airport 2',
    'Class 3: Clothes 1',
    'Class 4: Clothes 2',
    'Class 5: Verb "Tener"',
    'Class 6: Expressions with verb "Tener"',
    'Class 7: Definite article',
    'Class 8: Indefinite article',
    'Class 9: The plural',
    'Class 10: Regular -ER verbs',
    'Class 11: Regular -IR verbs'
  ];

  const module5Titles = [ // New titles for Module 5
    'Class 1: The human body',
    'Class 2: Diseases',
    'Class 3: First aid',
    'Class 4: Injuries',
    'Class 5: At the hospital',
    'Class 6: The muscles',
    'Class 7: Saying what hurts you',
    'Class 8: Verb "Doler"',
    'Class 9: The organs',
    'Class 10: Extra exercises'
  ];

  const genericModuleInstructions = "Actions: 1. Watch the video 2. Write down the words and phrases you hear in your notebook 3. Learn the vocabulary 4. Practice pronunciation with Carolina AI";


  for (let m = 1; m <= 5; m++) {
    const currentModuleVideoCount = (m === 3 || m === 4) ? 11 : 10; // Module 3 and 4 have 11 videos, others have 10
    for (let v = 1; v <= currentModuleVideoCount; v++) {
      const ytId = youtubeIds[m][v-1];
      let title: string;
      let instructions: string;

      if (m === 1) {
        title = `Class ${v}: ${module1Titles[v-1]}`;
        instructions = genericModuleInstructions; // Apply generic instructions
      } else if (m === 2) { 
        title = `Class ${v}: ${module2Titles[v-1]}`;
        instructions = genericModuleInstructions; // Apply generic instructions
      } else if (m === 3) { // Apply specific titles for Module 3
        title = module3Titles[v-1];
        instructions = genericModuleInstructions; // Apply generic instructions
      } else if (m === 4) { // Apply specific titles for Module 4
        title = module4Titles[v-1];
        instructions = genericModuleInstructions; // Apply generic instructions
      } else if (m === 5) { // Apply specific titles and instructions for Module 5
        title = module5Titles[v-1];
        instructions = genericModuleInstructions; // Apply generic instructions (was module5Instructions before)
      } else {
        // Fallback for any unexpected module, though all 1-5 are covered
        title = `Class ${v}`;
        instructions = genericModuleInstructions;
      }
      
      videos.push({
        id: `m${m}-v${v}`,
        module: m,
        title: title,
        thumbnail: `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`,
        url: `https://www.youtube.com/watch?v=${ytId}`,
        instructions: instructions
      });
    }
  }
  return videos;
};

export const VIDEO_LESSONS = generateVideos();

export const TEACHERS: Teacher[] = [
  {
    id: 'teacher-carolina',
    name: 'Carolina',
    bio: 'Certified Spanish teacher with a diploma from the Netherlands, CEO of Zayrolingua, and online class specialist. An expert in conversation-based learning, ensuring students speak Spanish from Day 1 while providing expert guidance in Spanish grammar.',
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=688',
    pricing: { bundle8: 240, monthly: 120 },
    rating: 5.0,
    availability: ['Wednesday', 'Thursday', 'Friday'],
    platforms: ['Zoom', 'Teams']
  },
  {
    id: 'teacher-scarlett',
    name: 'Scarlett',
    bio: 'Expert Spanish linguist and phonetics specialist. Scarlett focuses on accent reduction and natural Latino flow. She has helped hundreds of students reach conversational mastery through personalized coaching and modern methodology.',
    img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=688',
    pricing: { bundle8: 200, monthly: 100 },
    rating: 4.9,
    availability: ['Thursday', 'Friday', 'Saturday'],
    platforms: ['Zoom', 'Teams']
  }
];
