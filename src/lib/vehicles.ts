export type VehicleType = "passenger" | "commercial" | "truck" | "machine";

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  km: number;
  fuel: string;
  cc: number;
  price: number;
  type: VehicleType;
  image: string;
  images?: string[];
  badge?: string;
  horsepower?: number;
  transmission?: string;
  drive?: string;
  doors?: number;
  seats?: number;
  exteriorColor?: string;
  interiorColor?: string;
  emissions?: string;
  combinedConsumption?: string;
  grossWeight?: string;
  euroClass?: string;
  upholstery?: string;
  roadTax?: string;
  wheelSize?: string;
  cityConsumption?: string;
  highwayConsumption?: string;
  payload?: string;
  registration?: string;
  vin?: string;
  axles?: number;
  code?: string;
  url?: string;
  description?: string;
  features?: string[];
}

export const vehicles: Vehicle[] = [
  {
    "id": "3810",
    "brand": "Mercedes-Benz",
    "model": "A180 AMG LINE",
    "year": 2019,
    "km": 120000,
    "fuel": "Πετρέλαιο",
    "cc": 1461,
    "price": 0,
    "type": "passenger",
    "image": "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/d93c79a08f67ea93d5cd3ecbe587b0b5/3201d614d25df6b2a06499d355905b4b/2026/06/img_5021-scaled.jpeg",
    "images": [
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/d93c79a08f67ea93d5cd3ecbe587b0b5/3201d614d25df6b2a06499d355905b4b/2026/06/img_5021-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/d93c79a08f67ea93d5cd3ecbe587b0b5/3201d614d25df6b2a06499d355905b4b/2026/06/img_5008-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/d93c79a08f67ea93d5cd3ecbe587b0b5/3201d614d25df6b2a06499d355905b4b/2026/06/img_5034-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/d93c79a08f67ea93d5cd3ecbe587b0b5/3201d614d25df6b2a06499d355905b4b/2026/06/img_5015-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/d93c79a08f67ea93d5cd3ecbe587b0b5/3201d614d25df6b2a06499d355905b4b/2026/06/img_5024-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/d93c79a08f67ea93d5cd3ecbe587b0b5/3201d614d25df6b2a06499d355905b4b/2026/06/img_5029-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/d93c79a08f67ea93d5cd3ecbe587b0b5/3201d614d25df6b2a06499d355905b4b/2026/06/img_5042-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/d93c79a08f67ea93d5cd3ecbe587b0b5/3201d614d25df6b2a06499d355905b4b/2026/06/img_5044-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/d93c79a08f67ea93d5cd3ecbe587b0b5/3201d614d25df6b2a06499d355905b4b/2026/06/img_5052-scaled.jpeg"
    ],
    "badge": "ΝΕΑ ΑΦΙΞΗ",
    "horsepower": 0,
    "transmission": "Αυτόματο",
    "drive": "Προσθιοκίνητο",
    "doors": 0,
    "seats": 5,
    "interiorColor": "Δέρμα",
    "emissions": "Euro 6c Euroclass",
    "code": "3810",
    "url": "https://www.serroukas-cars.gr/car-repository/a180-amg-line/",
    "description": "",
    "features": [
      "Χρώμα",
      "Χρώμα εσωτερικό"
    ]
  },
  {
    "id": "3819",
    "brand": "Mercedes-Benz",
    "model": "A180 AMG LINE A45 S",
    "year": 2019,
    "km": 123000,
    "fuel": "Πετρέλαιο",
    "cc": 1461,
    "price": 0,
    "type": "passenger",
    "image": "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/d93c79a08f67ea93d5cd3ecbe587b0b5/3201d614d25df6b2a06499d355905b4b/2026/06/img_5265-1-scaled.jpeg",
    "images": [
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/d93c79a08f67ea93d5cd3ecbe587b0b5/3201d614d25df6b2a06499d355905b4b/2026/06/img_5265-1-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/d93c79a08f67ea93d5cd3ecbe587b0b5/f5bff02c9cd125d255a41bba3ff614aa/2026/06/img_5265-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/d93c79a08f67ea93d5cd3ecbe587b0b5/3201d614d25df6b2a06499d355905b4b/2026/06/img_5216-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/d93c79a08f67ea93d5cd3ecbe587b0b5/3201d614d25df6b2a06499d355905b4b/2026/06/img_5253-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/d93c79a08f67ea93d5cd3ecbe587b0b5/3201d614d25df6b2a06499d355905b4b/2026/06/img_5238-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/d93c79a08f67ea93d5cd3ecbe587b0b5/3201d614d25df6b2a06499d355905b4b/2026/06/img_5240-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/d93c79a08f67ea93d5cd3ecbe587b0b5/3201d614d25df6b2a06499d355905b4b/2026/06/img_5215-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/d93c79a08f67ea93d5cd3ecbe587b0b5/3201d614d25df6b2a06499d355905b4b/2026/06/img_5211-scaled.jpeg"
    ],
    "badge": "ΝΕΑ ΑΦΙΞΗ",
    "horsepower": 0,
    "transmission": "Αυτόματο",
    "drive": "Προσθιοκίνητο",
    "doors": 0,
    "seats": 5,
    "interiorColor": "Δέρμα - Ύφασμα",
    "emissions": "Euro 6 Euroclass",
    "code": "3819",
    "url": "https://www.serroukas-cars.gr/car-repository/a180-amg-line-a45-s/",
    "description": "",
    "features": [
      "Χρώμα",
      "Χρώμα εσωτερικό"
    ]
  },
  {
    "id": "2807",
    "brand": "Mercedes-Benz",
    "model": "ATEGO 1021",
    "year": 2016,
    "km": 454000,
    "fuel": "Πετρέλαιο",
    "cc": 5997,
    "price": 0,
    "type": "truck",
    "image": "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2024/11/img_6967-scaled.jpeg",
    "images": [
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2024/11/img_6967-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2024/11/img_6968-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2024/11/img_6969-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2024/11/img_6978-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2024/11/img_6981-scaled.jpeg"
    ],
    "badge": null,
    "horsepower": 180,
    "transmission": "Αυτόματο",
    "drive": "Πισωκίνητο",
    "doors": 2,
    "seats": 2,
    "interiorColor": "Βελούδο",
    "emissions": "Euro 6 Euroclass",
    "code": "2807",
    "url": "https://www.serroukas-cars.gr/car-repository/atego/",
    "description": "",
    "features": [
      "Χρώμα",
      "Χρώμα εσωτερικό"
    ]
  },
  {
    "id": "2858",
    "brand": "Mercedes-Benz",
    "model": "ATEGO 818",
    "year": 2016,
    "km": 499000,
    "fuel": "Πετρέλαιο",
    "cc": 5132,
    "price": 0,
    "type": "truck",
    "image": "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2024/12/img_6734-scaled.jpeg",
    "images": [
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2024/12/img_6734-scaled.jpeg"
    ],
    "badge": null,
    "horsepower": 180,
    "transmission": "Αυτόματο",
    "drive": "Πισωκίνητο",
    "doors": 2,
    "seats": 2,
    "interiorColor": "Ύφασμα",
    "emissions": "Euro 6 Euroclass",
    "code": "2858",
    "url": "https://www.serroukas-cars.gr/car-repository/atego-818/",
    "description": "",
    "features": [
      "Χρώμα",
      "Χρώμα εσωτερικό"
    ]
  },
  {
    "id": "2865",
    "brand": "Mercedes-Benz",
    "model": "ATEGO 818",
    "year": 2010,
    "km": 368000,
    "fuel": "Πετρέλαιο",
    "cc": 0,
    "price": 15000,
    "type": "truck",
    "image": "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2024/12/img_1818-scaled.jpeg",
    "images": [
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2024/12/img_1818-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/0e89ccedef7fdb65b6d529e2ee33fc56/2024/12/img_1827-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/0e89ccedef7fdb65b6d529e2ee33fc56/2024/12/img_1811-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/0e89ccedef7fdb65b6d529e2ee33fc56/2024/12/img_1821-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/0e89ccedef7fdb65b6d529e2ee33fc56/2024/12/img_1828-scaled.jpeg"
    ],
    "badge": null,
    "horsepower": 0,
    "transmission": "Χειροκίνητο",
    "drive": "Πισωκίνητο",
    "doors": 1,
    "seats": 1,
    "interiorColor": "Ύφασμα",
    "emissions": "Euro 5 Euroclass",
    "code": "2865",
    "url": "https://www.serroukas-cars.gr/car-repository/atego-818-2/",
    "description": "",
    "features": [
      "Χρώμα",
      "Χρώμα εσωτερικό"
    ]
  },
  {
    "id": "2759",
    "brand": "Citroen",
    "model": "AIR CROSS",
    "year": 2019,
    "km": 113000,
    "fuel": "Πετρέλαιο",
    "cc": 1499,
    "price": 20300,
    "type": "passenger",
    "image": "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/0e89ccedef7fdb65b6d529e2ee33fc56/2024/11/img_0319-1-scaled.jpeg",
    "images": [
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/0e89ccedef7fdb65b6d529e2ee33fc56/2024/11/img_0319-1-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/0e89ccedef7fdb65b6d529e2ee33fc56/2024/11/img_0319-2-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/0e89ccedef7fdb65b6d529e2ee33fc56/2024/11/img_0321-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/0e89ccedef7fdb65b6d529e2ee33fc56/2024/11/img_0293-scaled.jpeg"
    ],
    "badge": null,
    "horsepower": 131,
    "transmission": "Αυτόματο",
    "drive": "Προσθιοκίνητο",
    "doors": 5,
    "seats": 5,
    "interiorColor": "Δέρμα - Ύφασμα",
    "emissions": "Euro 6d-TEMP Euroclass",
    "code": "2759",
    "url": "https://www.serroukas-cars.gr/car-repository/citroen-air-cross/",
    "description": "",
    "features": [
      "Χρώμα",
      "Χρώμα εσωτερικό"
    ]
  },
  {
    "id": "3020",
    "brand": "Citroen",
    "model": "Berlingo",
    "year": 2019,
    "km": 157000,
    "fuel": "Πετρέλαιο",
    "cc": 1499,
    "price": 11500,
    "type": "commercial",
    "image": "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2025/01/img_0809-scaled.jpeg",
    "images": [
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2025/01/img_0809-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2025/01/img_0778.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2025/01/img_0779.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2025/01/img_0785.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2025/01/img_0801.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2025/01/img_0806.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2025/01/img_0808.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2025/01/img_0777.jpeg"
    ],
    "badge": null,
    "horsepower": 101,
    "transmission": "Χειροκίνητο",
    "drive": "Προσθιοκίνητο",
    "doors": 5,
    "seats": 2,
    "interiorColor": "Ύφασμα",
    "emissions": "Euro 6d Euroclass",
    "code": "3020",
    "url": "https://www.serroukas-cars.gr/car-repository/berlingo/",
    "description": "",
    "features": [
      "Χρώμα",
      "Χρώμα εσωτερικό"
    ]
  },
  {
    "id": "3215",
    "brand": "Fiat",
    "model": "500x",
    "year": 2020,
    "km": 134000,
    "fuel": "Βενζίνη",
    "cc": 1400,
    "price": 18800,
    "type": "passenger",
    "image": "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2025/11/img_3422-scaled.jpeg",
    "images": [
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2025/11/img_3422-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/d93c79a08f67ea93d5cd3ecbe587b0b5/f5bff02c9cd125d255a41bba3ff614aa/2026/05/img_3399-1-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/d93c79a08f67ea93d5cd3ecbe587b0b5/f5bff02c9cd125d255a41bba3ff614aa/2026/05/img_3390-1-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/d93c79a08f67ea93d5cd3ecbe587b0b5/f5bff02c9cd125d255a41bba3ff614aa/2026/05/img_3420-1-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/d93c79a08f67ea93d5cd3ecbe587b0b5/f5bff02c9cd125d255a41bba3ff614aa/2026/05/img_3387-scaled.jpeg"
    ],
    "badge": null,
    "horsepower": 0,
    "transmission": "Αυτόματο",
    "drive": "Προσθιοκίνητο",
    "doors": 5,
    "seats": 6040,
    "interiorColor": "Δέρμα - Ύφασμα",
    "emissions": "Euro 6 Euroclass",
    "code": "3215",
    "url": "https://www.serroukas-cars.gr/car-repository/500x/",
    "description": "",
    "features": [
      "Χρώμα",
      "Χρώμα εσωτερικό"
    ]
  },
  {
    "id": "2889",
    "brand": "Volvo",
    "model": "FL 250",
    "year": 2014,
    "km": 267000,
    "fuel": "Πετρέλαιο",
    "cc": 0,
    "price": 0,
    "type": "truck",
    "image": "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2024/12/img_4677-scaled.jpeg",
    "images": [
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2024/12/img_4677-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2024/12/img_4672-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2024/12/img_4683-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2024/12/img_4687-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2024/12/img_4707-scaled.jpeg"
    ],
    "badge": null,
    "horsepower": 250,
    "transmission": "Χειροκίνητο",
    "drive": "Πισωκίνητο",
    "doors": 1,
    "seats": 1,
    "interiorColor": "Ύφασμα",
    "emissions": "Euro 6 Euroclass",
    "code": "2889",
    "url": "https://www.serroukas-cars.gr/car-repository/fl-250/",
    "description": "",
    "features": [
      "Χρώμα",
      "Χρώμα εσωτερικό"
    ]
  },
  {
    "id": "2791",
    "brand": "Ford",
    "model": "CONNECT LONG",
    "year": 2017,
    "km": 171000,
    "fuel": "Πετρέλαιο",
    "cc": 1499,
    "price": 10990,
    "type": "commercial",
    "image": "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2024/11/img_8672-1-scaled.jpeg",
    "images": [
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2024/11/img_8672-1-scaled.jpeg"
    ],
    "badge": null,
    "horsepower": 101,
    "transmission": "Χειροκίνητο",
    "drive": "Προσθιοκίνητο",
    "doors": 1,
    "seats": 1,
    "interiorColor": "Βελούδο",
    "emissions": "Euro 6 Euroclass",
    "code": "2791",
    "url": "https://www.serroukas-cars.gr/car-repository/connect/",
    "description": "",
    "features": [
      "Χρώμα",
      "Χρώμα εσωτερικό"
    ]
  },
  {
    "id": "3182",
    "brand": "Ford",
    "model": "FIESTA ACTIVE",
    "year": 2019,
    "km": 154000,
    "fuel": "Βενζίνη",
    "cc": 999,
    "price": 14500,
    "type": "passenger",
    "image": "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/0e89ccedef7fdb65b6d529e2ee33fc56/2025/11/fiat-13.jpeg",
    "images": [
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/0e89ccedef7fdb65b6d529e2ee33fc56/2025/11/fiat-13.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/d93c79a08f67ea93d5cd3ecbe587b0b5/f5bff02c9cd125d255a41bba3ff614aa/2026/05/img_3157-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/0e89ccedef7fdb65b6d529e2ee33fc56/2025/11/whatsapp-image-2025-11-25-at-6.20.32-pm.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/d93c79a08f67ea93d5cd3ecbe587b0b5/f5bff02c9cd125d255a41bba3ff614aa/2026/05/img_3160-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/d93c79a08f67ea93d5cd3ecbe587b0b5/f5bff02c9cd125d255a41bba3ff614aa/2026/05/img_3161-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/d93c79a08f67ea93d5cd3ecbe587b0b5/f5bff02c9cd125d255a41bba3ff614aa/2026/05/img_3167-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/d93c79a08f67ea93d5cd3ecbe587b0b5/f5bff02c9cd125d255a41bba3ff614aa/2026/05/img_3151-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/d93c79a08f67ea93d5cd3ecbe587b0b5/f5bff02c9cd125d255a41bba3ff614aa/2026/05/img_3181-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/d93c79a08f67ea93d5cd3ecbe587b0b5/f5bff02c9cd125d255a41bba3ff614aa/2026/05/img_3172-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/d93c79a08f67ea93d5cd3ecbe587b0b5/f5bff02c9cd125d255a41bba3ff614aa/2026/05/img_3187-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/d93c79a08f67ea93d5cd3ecbe587b0b5/f5bff02c9cd125d255a41bba3ff614aa/2026/05/img_3190-scaled.jpeg"
    ],
    "badge": null,
    "horsepower": 100,
    "transmission": "Αυτόματο",
    "drive": "Προσθιοκίνητο",
    "doors": 1,
    "seats": 1,
    "interiorColor": "Ύφασμα",
    "emissions": "Euro 6 Euroclass",
    "code": "3182",
    "url": "https://www.serroukas-cars.gr/car-repository/active-fiesta/",
    "description": "",
    "features": [
      "Χρώμα",
      "Χρώμα εσωτερικό"
    ]
  },
  {
    "id": "3164",
    "brand": "Ford",
    "model": "RANGER RS-MT",
    "year": 2022,
    "km": 101000,
    "fuel": "Πετρέλαιο",
    "cc": 1998,
    "price": 35900,
    "type": "commercial",
    "image": "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/d93c79a08f67ea93d5cd3ecbe587b0b5/0e89ccedef7fdb65b6d529e2ee33fc56/2025/09/img_2694.jpeg",
    "images": [
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/d93c79a08f67ea93d5cd3ecbe587b0b5/0e89ccedef7fdb65b6d529e2ee33fc56/2025/09/img_2694.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2025/09/whatsapp-image-2025-09-13-at-13.36.33_880c2054-1.jpg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2025/09/whatsapp-image-2025-09-13-at-13.36.33_880c2054-2.jpg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2025/09/whatsapp-image-2025-09-13-at-13.36.33_880c2054.jpg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/d93c79a08f67ea93d5cd3ecbe587b0b5/0e89ccedef7fdb65b6d529e2ee33fc56/2025/09/img_2681.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/d93c79a08f67ea93d5cd3ecbe587b0b5/0e89ccedef7fdb65b6d529e2ee33fc56/2025/09/img_2685.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/d93c79a08f67ea93d5cd3ecbe587b0b5/0e89ccedef7fdb65b6d529e2ee33fc56/2025/09/img_2674.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/0e89ccedef7fdb65b6d529e2ee33fc56/2025/09/img_2676-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/d93c79a08f67ea93d5cd3ecbe587b0b5/0e89ccedef7fdb65b6d529e2ee33fc56/2025/09/img_2670.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/d93c79a08f67ea93d5cd3ecbe587b0b5/0e89ccedef7fdb65b6d529e2ee33fc56/2025/09/img_2682.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/d93c79a08f67ea93d5cd3ecbe587b0b5/0e89ccedef7fdb65b6d529e2ee33fc56/2025/09/img_2698.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/d93c79a08f67ea93d5cd3ecbe587b0b5/0e89ccedef7fdb65b6d529e2ee33fc56/2025/09/img_2707.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/d93c79a08f67ea93d5cd3ecbe587b0b5/0e89ccedef7fdb65b6d529e2ee33fc56/2025/09/img_2711.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/d93c79a08f67ea93d5cd3ecbe587b0b5/0e89ccedef7fdb65b6d529e2ee33fc56/2025/09/img_2712.jpeg"
    ],
    "badge": null,
    "horsepower": 113,
    "transmission": "Αυτόματο",
    "drive": "Πισωκίνητο",
    "doors": 5,
    "seats": 5,
    "interiorColor": "Δέρμα",
    "emissions": "Euro 6d Euroclass",
    "code": "3164",
    "url": "https://www.serroukas-cars.gr/car-repository/ford/",
    "description": "",
    "features": [
      "Χρώμα",
      "Χρώμα εσωτερικό"
    ]
  },
  {
    "id": "3125",
    "brand": "Ford",
    "model": "RANGER WILDTRACK",
    "year": 2019,
    "km": 193000,
    "fuel": "Πετρέλαιο",
    "cc": 3200,
    "price": 24900,
    "type": "commercial",
    "image": "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2025/06/img_1868-scaled.jpeg",
    "images": [
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2025/06/img_1868-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2025/06/img_1864.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2025/06/img_1867.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2025/06/img_1874.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2025/06/img_1881.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2025/06/img_1882.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2025/06/img_1848.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2025/06/img_1851.jpeg"
    ],
    "badge": null,
    "horsepower": 212,
    "transmission": "Αυτόματο",
    "drive": "Πισωκίνητο",
    "doors": 5,
    "seats": 5,
    "interiorColor": "Δέρμα - Ύφασμα",
    "emissions": "Euro 6 Euroclass",
    "code": "3125",
    "url": "https://www.serroukas-cars.gr/car-repository/renger/",
    "description": "",
    "features": [
      "Χρώμα",
      "Χρώμα εσωτερικό"
    ]
  },
  {
    "id": "3226",
    "brand": "Ford",
    "model": "RANGER WILDTRACK",
    "year": 2021,
    "km": 136000,
    "fuel": "Πετρέλαιο",
    "cc": 2000,
    "price": 28900,
    "type": "commercial",
    "image": "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/0e89ccedef7fdb65b6d529e2ee33fc56/2025/09/img_2206.jpeg",
    "images": [
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/0e89ccedef7fdb65b6d529e2ee33fc56/2025/09/img_2206.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/0e89ccedef7fdb65b6d529e2ee33fc56/2026/03/img_4280-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2025/09/whatsapp-image-2025-09-13-at-13.36.33_880c2054-1.jpg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2025/09/whatsapp-image-2025-09-13-at-13.36.33_880c2054-2.jpg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2025/09/whatsapp-image-2025-09-13-at-13.36.33_880c2054.jpg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/0e89ccedef7fdb65b6d529e2ee33fc56/2025/09/img_2676-scaled.jpeg"
    ],
    "badge": "ΝΕΑ ΑΦΙΞΗ",
    "horsepower": 213,
    "transmission": "Αυτόματο",
    "drive": "Πισωκίνητο",
    "doors": 1,
    "seats": 6040,
    "interiorColor": "Δέρμα",
    "emissions": "Euro 6d-TEMP Euroclass",
    "code": "3226",
    "url": "https://www.serroukas-cars.gr/car-repository/renger-2/",
    "description": "",
    "features": [
      "Χρώμα",
      "Χρώμα εσωτερικό"
    ]
  },
  {
    "id": "2813",
    "brand": "Ford",
    "model": "TRANSIT",
    "year": 2017,
    "km": 195000,
    "fuel": "Πετρέλαιο",
    "cc": 2000,
    "price": 16900,
    "type": "commercial",
    "image": "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2024/11/img_6103-scaled.jpeg",
    "images": [
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2024/11/img_6103-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2024/11/img_6101-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2024/11/img_6094-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2024/11/img_6112-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2024/11/img_6089-scaled.jpeg"
    ],
    "badge": null,
    "horsepower": 131,
    "transmission": "Χειροκίνητο",
    "drive": "Προσθιοκίνητο",
    "doors": 5,
    "seats": 3,
    "interiorColor": "Δέρμα - Ύφασμα",
    "emissions": "Euro 6 Euroclass",
    "code": "2813",
    "url": "https://www.serroukas-cars.gr/car-repository/ford-tranzit/",
    "description": "",
    "features": [
      "Χρώμα",
      "Χρώμα εσωτερικό"
    ]
  },
  {
    "id": "2883",
    "brand": "MAN",
    "model": "MAN 8180",
    "year": 2010,
    "km": 176000,
    "fuel": "Πετρέλαιο",
    "cc": 0,
    "price": 16800,
    "type": "truck",
    "image": "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2024/12/img_2238-scaled.jpeg",
    "images": [
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2024/12/img_2238-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2024/12/img_2231-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2024/12/img_2223-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2024/12/img_2239-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2024/12/img_2247-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2024/12/img_2253-scaled.jpeg"
    ],
    "badge": null,
    "horsepower": 180,
    "transmission": "Αυτόματο",
    "drive": "Πισωκίνητο",
    "doors": 1,
    "seats": 1,
    "interiorColor": "Βελούδο",
    "emissions": "Euro 4 Euroclass",
    "code": "2883",
    "url": "https://www.serroukas-cars.gr/car-repository/8180/",
    "description": "",
    "features": [
      "Χρώμα",
      "Χρώμα εσωτερικό"
    ]
  },
  {
    "id": "2870",
    "brand": "MAN",
    "model": "MAN TGL 15250",
    "year": 2012,
    "km": 445000,
    "fuel": "Πετρέλαιο",
    "cc": 0,
    "price": 0,
    "type": "truck",
    "image": "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/0e89ccedef7fdb65b6d529e2ee33fc56/2024/12/img_5793-1-scaled.jpeg",
    "images": [
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/0e89ccedef7fdb65b6d529e2ee33fc56/2024/12/img_5793-1-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/0e89ccedef7fdb65b6d529e2ee33fc56/2024/12/img_5765.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/0e89ccedef7fdb65b6d529e2ee33fc56/2024/12/img_5774.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/0e89ccedef7fdb65b6d529e2ee33fc56/2024/12/img_5784.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/0e89ccedef7fdb65b6d529e2ee33fc56/2024/12/img_5816.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/0e89ccedef7fdb65b6d529e2ee33fc56/2024/12/img_5810.jpeg"
    ],
    "badge": null,
    "horsepower": 250,
    "transmission": "Χειροκίνητο",
    "drive": "Πισωκίνητο",
    "doors": 1,
    "seats": 1,
    "interiorColor": "Ύφασμα",
    "emissions": "Euro 5 Euroclass",
    "code": "2870",
    "url": "https://www.serroukas-cars.gr/car-repository/15250/",
    "description": "",
    "features": [
      "Χρώμα",
      "Χρώμα εσωτερικό"
    ]
  },
  {
    "id": "3180",
    "brand": "Mercedes-Benz",
    "model": "A180",
    "year": 2015,
    "km": 160000,
    "fuel": "Πετρέλαιο",
    "cc": 1461,
    "price": 15800,
    "type": "passenger",
    "image": "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/0e89ccedef7fdb65b6d529e2ee33fc56/2025/11/img_3474-scaled.jpeg",
    "images": [
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/0e89ccedef7fdb65b6d529e2ee33fc56/2025/11/img_3474-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/0e89ccedef7fdb65b6d529e2ee33fc56/2025/11/img_3480.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/0e89ccedef7fdb65b6d529e2ee33fc56/2025/11/img_3471.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/0e89ccedef7fdb65b6d529e2ee33fc56/2025/11/img_3468.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/0e89ccedef7fdb65b6d529e2ee33fc56/2025/11/img_3483.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/0e89ccedef7fdb65b6d529e2ee33fc56/2025/11/img_3490.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/0e89ccedef7fdb65b6d529e2ee33fc56/2025/11/img_3498.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/0e89ccedef7fdb65b6d529e2ee33fc56/2025/11/img_3500.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/0e89ccedef7fdb65b6d529e2ee33fc56/2025/11/img_3509.jpeg"
    ],
    "badge": null,
    "horsepower": 115,
    "transmission": "Χειροκίνητο",
    "drive": "Προσθιοκίνητο",
    "doors": 5,
    "seats": 5,
    "interiorColor": "Δέρμα - Ύφασμα",
    "emissions": "Euro 6 Euroclass",
    "code": "3180",
    "url": "https://www.serroukas-cars.gr/car-repository/a180-2/",
    "description": "",
    "features": [
      "Χρώμα",
      "Χρώμα εσωτερικό"
    ]
  },
  {
    "id": "2918",
    "brand": "Nissan",
    "model": "Cabstar",
    "year": 2009,
    "km": 150000,
    "fuel": "Πετρέλαιο",
    "cc": 2952,
    "price": 0,
    "type": "truck",
    "image": "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2024/12/img_7459-scaled.jpeg",
    "images": [
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2024/12/img_7459-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2024/12/img_7482.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2024/12/img_7489.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2024/12/img_7498.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2024/12/img_7504.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2024/12/img_7506.jpeg"
    ],
    "badge": null,
    "horsepower": 150,
    "transmission": "Αυτόματο",
    "drive": "Πισωκίνητο",
    "doors": 1,
    "seats": 3,
    "interiorColor": "Βελούδο",
    "emissions": "Euro 5 Euroclass",
    "code": "2918",
    "url": "https://www.serroukas-cars.gr/car-repository/nissan-cabstar/",
    "description": "",
    "features": [
      "Χρώμα",
      "Χρώμα εσωτερικό"
    ]
  },
  {
    "id": "2833",
    "brand": "Opel",
    "model": "COMBO",
    "year": 2019,
    "km": 166000,
    "fuel": "Πετρέλαιο",
    "cc": 0,
    "price": 12500,
    "type": "commercial",
    "image": "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2024/11/img_7689-scaled.jpeg",
    "images": [
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2024/11/img_7689-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2024/11/img_7684-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2024/11/img_7695-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2024/11/img_7698-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2024/11/img_7682-scaled.jpeg"
    ],
    "badge": null,
    "horsepower": 75,
    "transmission": "Χειροκίνητο",
    "drive": "Προσθιοκίνητο",
    "doors": 5,
    "seats": 2,
    "interiorColor": "Ύφασμα",
    "emissions": "Euro 6 Euroclass",
    "code": "2833",
    "url": "https://www.serroukas-cars.gr/car-repository/opel-combo/",
    "description": "",
    "features": [
      "Χρώμα",
      "Χρώμα εσωτερικό"
    ]
  },
  {
    "id": "2426",
    "brand": "Opel",
    "model": "MOKKA GS LINE",
    "year": 2021,
    "km": 102000,
    "fuel": "Βενζίνη",
    "cc": 0,
    "price": 19990,
    "type": "passenger",
    "image": "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2024/09/img_97211-scaled.jpg",
    "images": [
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2024/09/img_97211-scaled.jpg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/0e89ccedef7fdb65b6d529e2ee33fc56/2026/03/img_3208-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/0e89ccedef7fdb65b6d529e2ee33fc56/2026/03/img_3204.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/0e89ccedef7fdb65b6d529e2ee33fc56/2026/03/img_3228.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2024/09/img_96931-scaled.jpg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/0e89ccedef7fdb65b6d529e2ee33fc56/2026/03/img_3201.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/0e89ccedef7fdb65b6d529e2ee33fc56/2026/03/img_3229.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/0e89ccedef7fdb65b6d529e2ee33fc56/2026/03/img_3232.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/0e89ccedef7fdb65b6d529e2ee33fc56/2026/03/img_3233.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2024/09/img_96941-scaled.jpg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2024/09/img_97121-scaled.jpg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2024/09/img_97231-scaled.jpg"
    ],
    "badge": null,
    "horsepower": 130,
    "transmission": "Αυτόματο",
    "drive": "Προσθιοκίνητο",
    "doors": 5,
    "seats": 6040,
    "interiorColor": "Δέρμα - Ύφασμα",
    "emissions": "Euro 6d-TEMP Euroclass",
    "code": "2426",
    "url": "https://www.serroukas-cars.gr/car-repository/mokka-gs-line/",
    "description": "",
    "features": [
      "Χρώμα",
      "Χρώμα εσωτερικό"
    ]
  },
  {
    "id": "3178",
    "brand": "Peugeot",
    "model": "2008",
    "year": 2021,
    "km": 84000,
    "fuel": "Πετρέλαιο",
    "cc": 1498,
    "price": 20300,
    "type": "passenger",
    "image": "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/0e89ccedef7fdb65b6d529e2ee33fc56/2025/11/img_2937-1-scaled.jpeg",
    "images": [
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/0e89ccedef7fdb65b6d529e2ee33fc56/2025/11/img_2937-1-scaled.jpeg"
    ],
    "badge": null,
    "horsepower": 130,
    "transmission": "Αυτόματο",
    "drive": "Προσθιοκίνητο",
    "doors": 5,
    "seats": 5,
    "interiorColor": "Δέρμα - Ύφασμα",
    "emissions": "Euro 6d-TEMP Euroclass",
    "code": "3178",
    "url": "https://www.serroukas-cars.gr/car-repository/2008/",
    "description": "",
    "features": [
      "Χρώμα",
      "Χρώμα εσωτερικό"
    ]
  },
  {
    "id": "2758",
    "brand": "Renault",
    "model": "CAPTUR",
    "year": 2020,
    "km": 106000,
    "fuel": "Πετρέλαιο",
    "cc": 0,
    "price": 18900,
    "type": "passenger",
    "image": "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/0e89ccedef7fdb65b6d529e2ee33fc56/2024/11/img_0163-2-scaled.jpeg",
    "images": [
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/0e89ccedef7fdb65b6d529e2ee33fc56/2024/11/img_0163-2-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/0e89ccedef7fdb65b6d529e2ee33fc56/2024/11/img_0162-1-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/0e89ccedef7fdb65b6d529e2ee33fc56/2024/11/img_0090-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/0e89ccedef7fdb65b6d529e2ee33fc56/2024/11/img_0164-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/0e89ccedef7fdb65b6d529e2ee33fc56/2024/11/img_0071-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/0e89ccedef7fdb65b6d529e2ee33fc56/2024/11/img_0077-scaled.jpeg"
    ],
    "badge": null,
    "horsepower": 115,
    "transmission": "Αυτόματο",
    "drive": "Προσθιοκίνητο",
    "doors": 5,
    "seats": 5,
    "interiorColor": "Βελούδο",
    "emissions": "Euro 6d Euroclass",
    "code": "2758",
    "url": "https://www.serroukas-cars.gr/car-repository/renaualt-captur/",
    "description": "",
    "features": [
      "Χρώμα",
      "Χρώμα εσωτερικό"
    ]
  },
  {
    "id": "3880",
    "brand": "Renault",
    "model": "CAPTUR INITIALE PARIS EDITION",
    "year": 2020,
    "km": 142,
    "fuel": "Πετρέλαιο",
    "cc": 1461,
    "price": 22000,
    "type": "passenger",
    "image": "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/d93c79a08f67ea93d5cd3ecbe587b0b5/3201d614d25df6b2a06499d355905b4b/2026/07/img_3054.jpeg",
    "images": [
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/d93c79a08f67ea93d5cd3ecbe587b0b5/3201d614d25df6b2a06499d355905b4b/2026/07/img_3054.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/d93c79a08f67ea93d5cd3ecbe587b0b5/3201d614d25df6b2a06499d355905b4b/2026/07/img_3056-1.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/d93c79a08f67ea93d5cd3ecbe587b0b5/3201d614d25df6b2a06499d355905b4b/2026/07/img_3058.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/d93c79a08f67ea93d5cd3ecbe587b0b5/3201d614d25df6b2a06499d355905b4b/2026/07/img_3060.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/d93c79a08f67ea93d5cd3ecbe587b0b5/3201d614d25df6b2a06499d355905b4b/2026/07/img_3062.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/d93c79a08f67ea93d5cd3ecbe587b0b5/3201d614d25df6b2a06499d355905b4b/2026/07/img_3064.jpeg"
    ],
    "badge": "ΝΕΑ ΑΦΙΞΗ",
    "horsepower": 116,
    "transmission": "Αυτόματο",
    "drive": "Προσθιοκίνητο",
    "doors": 5,
    "seats": 5,
    "interiorColor": "Βελούδο",
    "emissions": "Euro 6 Euroclass",
    "code": "3880",
    "url": "https://www.serroukas-cars.gr/car-repository/renault-captur-initiale-paris-edition/",
    "description": "",
    "features": [
      "Χρώμα",
      "Χρώμα εσωτερικό"
    ]
  },
  {
    "id": "3116",
    "brand": "Renault",
    "model": "KADJAR INITIALE",
    "year": 2020,
    "km": 154000,
    "fuel": "Πετρέλαιο",
    "cc": 1461,
    "price": 18990,
    "type": "passenger",
    "image": "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2025/06/img_2039-scaled.jpeg",
    "images": [
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2025/06/img_2039-scaled.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2025/06/img_2053.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2025/06/img_2032.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2025/06/img_2038.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2025/06/img_2047.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2025/06/img_2050.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2025/06/img_2062.jpeg",
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2025/06/img_2024.jpeg"
    ],
    "badge": null,
    "horsepower": 115,
    "transmission": "Αυτόματο",
    "drive": "Προσθιοκίνητο",
    "doors": 5,
    "seats": 5,
    "interiorColor": "Δέρμα - Ύφασμα",
    "emissions": "Euro 6d-TEMP Euroclass",
    "code": "3116",
    "url": "https://www.serroukas-cars.gr/car-repository/automatic/",
    "description": "",
    "features": [
      "Χρώμα",
      "Χρώμα εσωτερικό"
    ]
  },
  {
    "id": "3225",
    "brand": "Volkswagen",
    "model": "AMAROK AVENTURA",
    "year": 2020,
    "km": 225000,
    "fuel": "Πετρέλαιο",
    "cc": 2998,
    "price": 26500,
    "type": "commercial",
    "image": "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/0e89ccedef7fdb65b6d529e2ee33fc56/2026/03/img_4142-scaled.jpeg",
    "images": [
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/0e89ccedef7fdb65b6d529e2ee33fc56/2026/03/img_4142-scaled.jpeg"
    ],
    "badge": null,
    "horsepower": 258,
    "transmission": "Αυτόματο",
    "drive": "Προσθιοκίνητο",
    "doors": 5,
    "seats": 6040,
    "interiorColor": "Δέρμα",
    "emissions": "Euro 6d Euroclass",
    "code": "3225",
    "url": "https://www.serroukas-cars.gr/car-repository/anentoyra-amarok2020/",
    "description": "",
    "features": [
      "Χρώμα",
      "Χρώμα εσωτερικό"
    ]
  },
  {
    "id": "2842",
    "brand": "Mercedes-Benz",
    "model": "Vito extra long ψυγείο",
    "year": 2016,
    "km": 200,
    "fuel": "Πετρέλαιο",
    "cc": 1600,
    "price": 17900,
    "type": "commercial",
    "image": "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2024/11/img_5376-scaled.jpeg",
    "images": [
      "https://www.serroukas-cars.gr/wp-content/uploads/jet-form-builder/30d73208d2faf2d850b0ee41fdaad82b/2024/11/img_5376-scaled.jpeg"
    ],
    "badge": null,
    "horsepower": 100,
    "transmission": "Χειροκίνητο",
    "drive": "Προσθιοκίνητο",
    "doors": 5,
    "seats": 3,
    "interiorColor": "Βελούδο",
    "emissions": "Euro 6 Euroclass",
    "code": "2842",
    "url": "https://www.serroukas-cars.gr/car-repository/vito-extra-long-%cf%88%cf%85%ce%b3%ce%b5%ce%af%ce%bf/",
    "description": "",
    "features": [
      "Χρώμα",
      "Χρώμα εσωτερικό"
    ]
  }
];

export interface Brand {
  name: string;
  logo: string;
}

export const brands: Brand[] = [
  {
    "name": "Citroen",
    "logo": "https://www.serroukas-cars.gr/wp-content/uploads/2024/06/make-13214-150x150.png.webp"
  },
  {
    "name": "Fiat",
    "logo": "https://www.serroukas-cars.gr/wp-content/uploads/2024/06/make-13302-150x150.png.webp"
  },
  {
    "name": "Ford",
    "logo": "https://www.serroukas-cars.gr/wp-content/uploads/2024/06/make-13272-150x150.png.webp"
  },
  {
    "name": "MAN",
    "logo": "https://www.serroukas-cars.gr/wp-content/uploads/2024/06/make-13883-qu6fq3rzclcj5qcjk45n1xrjs9dufl7o1y2nknqw0g.png"
  },
  {
    "name": "Mercedes-Benz",
    "logo": "https://www.serroukas-cars.gr/wp-content/uploads/2024/06/make-32186-150x150.png.webp"
  },
  {
    "name": "Nissan",
    "logo": "https://www.serroukas-cars.gr/wp-content/uploads/2024/06/make-14094-150x150.png.webp"
  },
  {
    "name": "Opel",
    "logo": "https://www.serroukas-cars.gr/wp-content/uploads/2024/06/make-14093-qu6fub3zwx3p2y8q0fkkpdkrfanxuuwgar3tu7ii6o.png"
  },
  {
    "name": "Peugeot",
    "logo": "https://www.serroukas-cars.gr/wp-content/uploads/2024/06/make-13198-qu6fptfrqygy98120217mxwtnyhgjmcwp8qdr6d3xc.png"
  },
  {
    "name": "Renault",
    "logo": "https://www.serroukas-cars.gr/wp-content/uploads/2024/06/make-13696-qu6fq1wayx9yiif9v3cdwy8mlhn40707dorom3tocw.png"
  },
  {
    "name": "Volkswagen",
    "logo": "https://www.serroukas-cars.gr/wp-content/uploads/2024/06/make-13696-qu6fq1wayx9yiif9v3cdwy8mlhn40707dorom3tocw.png"
  },
  {
    "name": "Volvo",
    "logo": "https://www.serroukas-cars.gr/wp-content/uploads/2024/06/make-13883-qu6fq3rzclcj5qcjk45n1xrjs9dufl7o1y2nknqw0g.png"
  }
];

export const brandNames = brands.map((b) => b.name);
