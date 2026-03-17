export interface Product {
  id: number;
  name: string;
  price: string;
  category: string;
  description: string;
  image: string;
}

export const products: Product[] = [
  { 
    id: 1, 
    name: "PRIMITIVE PRIMXTERM-MACHINEHOOD", 
    price: "€89,95", 
    category: "Kledij", 
    description: "Premium hoodie met een unieke Primitive machine-print. Gemaakt van zware kwaliteit katoen voor maximale duurzaamheid en comfort tijdens het skaten.",
    image: "/images/products/primitive-primxterm-machinehood-heathergrey.jpg"
  },
  { 
    id: 2, 
    name: "PRIMXTERM BOXSET LEMOS DECK 8.0", 
    price: "€90,00", 
    category: "Skateboards", 
    description: "Tiago Lemos signature deck. De perfecte 8.0 concave voor technische tricks en stabiliteit. Inclusief exclusieve Primxterm graphics.",
    image: "/images/products/primitive-primxterm-boxsetlemosdeck-8.jpg"
  },
  { 
    id: 3, 
    name: "HAMILTON SHADOW DECK", 
    price: "€80,00", 
    category: "Skateboards", 
    description: "Spencer Hamilton pro model. Slank design met een krachtige pop. Uitermate geschikt voor street skaten en rails.",
    image: "/images/products/primitive-hamilton-shadow-deck-black.jpg"
  },
  { 
    id: 4, 
    name: "PRIMXTERM NO FATE DECK 8.25", 
    price: "€90,00", 
    category: "Skateboards", 
    description: "Classic 8.25 deck met de iconische 'No Fate' graphics. Een favoriet onder de local riders in Blankenberge.",
    image: "/images/products/primitive-primxterm-nofatedeck-825.jpg"
  },
  { 
    id: 5, 
    name: "PRIMITIVE PRIMXTERM-BOXSETTEE", 
    price: "€39,95", 
    category: "Kledij", 
    description: "Standard fit T-shirt met borstprint. Ademend materiaal, ideaal voor de zomerse sessies aan de kust.",
    image: "/images/products/primitive-primxterm-boxsettee-black.jpg"
  },
  { 
    id: 6, 
    name: "DAILY GRIND TEAM DECK", 
    price: "€60,00", 
    category: "Skateboards", 
    description: "Ons eigen Daily Grind shop deck. Hoogwaardig Canadees esdoornhout. Support your local shop!",
    image: "/images/products/skateboards.jpg"
  },
  { 
    id: 7, 
    name: "PRIMXTERM BOXSET L/S TEE", 
    price: "€45,00", 
    category: "Kledij", 
    description: "Longsleeve T-shirt met technische prints op de mouwen. Perfect voor de koelere herfstdagen.",
    image: "/images/products/primitive-primxterm-boxsetl-stee-black.jpg" 
  },
  { 
    id: 8, 
    name: "BREAKDOWN BEANIE", 
    price: "€30,00", 
    category: "Accessoires", 
    description: "Warme, geribbelde muts met geborduurd Primitive logo. Een must-have voor de koude dagen aan de Belgische kust.",
    image: "/images/products/primitive-breakdown-beanie-black.jpg" 
  },
  { 
    id: 9, 
    name: "CURRENCY HOOD", 
    price: "€99,95", 
    category: "Kledij", 
    description: "Zware kwaliteit hoodie in 'hunter green' kleur. Minimalistische stijl maar maximale uitstraling.",
    image: "/images/products/primitive-currency-hood-hunter-green.jpg" 
  },
  { 
    id: 10, 
    name: "PRIMXTERM MACHINETEE", 
    price: "€39,95", 
    category: "Kledij", 
    description: "Lichtgewicht katoenen T-shirt met de iconische machine graphics.",
    image: "/images/products/primitive-primxterm-machinetee-black.jpg" 
  },
  { 
    id: 11, 
    name: "CORE SKATE SHOE", 
    price: "€84,95", 
    category: "Schoenen", 
    description: "Duurzame skateschoenen ontworpen voor grip en boardfeel. Versterkt op de plekken waar je het 't meeste nodig hebt.",
    image: "/images/products/schoenen.jpg" 
  },
  { 
    id: 12, 
    name: "ESSENTIAL ACCESSORIES", 
    price: "€30,00", 
    category: "Accessoires", 
    description: "Een selectie van onze favoriete accessoires voor dagelijks gebruik.",
    image: "/images/products/accessoires.jpg" 
  },
];
