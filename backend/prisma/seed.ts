import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data in reverse order of relations
  await prisma.productReview.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.wishlistItem.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.userProfile.deleteMany({});
  await prisma.user.deleteMany({});

  // Seed Users
  const adminPasswordHash = await bcrypt.hash('AdminPassword123', 10);
  const userPasswordHash = await bcrypt.hash('UserPassword123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@ridex.com',
      passwordHash: adminPasswordHash,
      firstName: 'RideX',
      lastName: 'Admin',
      role: 'ADMIN',
      profile: { create: { phone: '1234567890' } }
    }
  });

  const user = await prisma.user.create({
    data: {
      email: 'user@ridex.com',
      passwordHash: userPasswordHash,
      firstName: 'John',
      lastName: 'Doe',
      role: 'USER',
      profile: { create: { phone: '0987654321' } }
    }
  });

  console.log('Seeded Users:', { admin: admin.email, user: user.email });

  // Seed Categories
  const catHelmets = await prisma.category.create({
    data: {
      name: 'Helmets',
      slug: 'helmets',
      description: 'Full-face, modular, and off-road motorcycle helmets.',
      imageUrl: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=600&q=80'
    }
  });

  const catJackets = await prisma.category.create({
    data: {
      name: 'Riding Jackets',
      slug: 'riding-jackets',
      description: 'Leather and textile protective riding jackets.',
      imageUrl: 'https://images.unsplash.com/photo-1551698618-1fed5d97d256?auto=format&fit=crop&w=600&q=80'
    }
  });

  const catGloves = await prisma.category.create({
    data: {
      name: 'Riding Gloves',
      slug: 'riding-gloves',
      description: 'Leather, mesh, and winter riding gloves.',
      imageUrl: 'https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=600&q=80'
    }
  });

  const catPants = await prisma.category.create({
    data: {
      name: 'Riding Pants',
      slug: 'riding-pants',
      description: 'Protective riding jeans and leather race pants.',
      imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80'
    }
  });

  const catBoots = await prisma.category.create({
    data: {
      name: 'Riding Boots',
      slug: 'riding-boots',
      description: 'Track, touring, and adventure riding boots.',
      imageUrl: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=600&q=80'
    }
  });

  const catBags = await prisma.category.create({
    data: {
      name: 'Bags & Saddlebags',
      slug: 'bags-saddlebags',
      description: 'Waterproof tail bags, tank bags, and adventure luggage.',
      imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80'
    }
  });

  const catAccessories = await prisma.category.create({
    data: {
      name: 'Touring Accessories',
      slug: 'touring-accessories',
      description: 'Intercom communicators, phone mounts, and LED kits.',
      imageUrl: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=600&q=80'
    }
  });

  console.log('Seeded Categories');

  // Seed Products
  const products = [
    // Helmets
    {
      categoryId: catHelmets.id,
      name: 'Shoei X-Fifteen Helmet',
      slug: 'shoei-x-fifteen-helmet',
      description: 'The Shoei X-Fifteen is a pure racing helmet. Tested in the wind tunnel, it features advanced aerodynamics, ventilation, and a premium AIM+ shell.',
      price: 899.99,
      compareAtPrice: 949.99,
      sku: 'SHO-X15-BLK',
      stock: 15,
      images: ['https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=600&q=80'],
      isFeatured: true,
      specifications: {
        weight: '1550g',
        safety: 'ECE 22.06 / Snell M2020D',
        material: 'AIM+ Fiber',
        sizeChart: {
          S: '55-56 cm',
          M: '57-58 cm',
          L: '59-60 cm',
          XL: '61-62 cm'
        }
      }
    },
    {
      categoryId: catHelmets.id,
      name: 'Arai Corsair X Helmet',
      slug: 'arai-corsair-x-helmet',
      description: 'Widely regarded as the pinnacle of helmet safety, the Arai Corsair X provides maximum impact dissipation and superior comfort with a PB-SNC2 shell.',
      price: 849.99,
      sku: 'ARA-CORX-BLU',
      stock: 12,
      images: ['https://images.unsplash.com/photo-1581636625402-29b2a704ef13?auto=format&fit=crop&w=600&q=80'],
      isFeatured: false,
      specifications: {
        weight: '1620g',
        safety: 'Snell M2020 / DOT',
        material: 'Super Fiber Laminate',
        sizeChart: {
          S: '55-56 cm',
          M: '57-58 cm',
          L: '59-60 cm',
          XL: '61-62 cm'
        }
      }
    },
    {
      categoryId: catHelmets.id,
      name: 'AGV Pista GP RR Helmet',
      slug: 'agv-pista-gp-rr-helmet',
      description: 'An exact replica of the helmet worn by world championship racers. Fully structured in carbon fiber with an integrated hydration tube.',
      price: 1399.99,
      compareAtPrice: 1499.99,
      sku: 'AGV-PISTA-CARB',
      stock: 5,
      images: ['https://images.unsplash.com/photo-1627738221160-c3d971501c3b?auto=format&fit=crop&w=600&q=80'],
      isFeatured: true,
      specifications: {
        weight: '1450g',
        safety: 'FIM Racing Homologated / ECE 22.06',
        material: '100% Carbon Fiber',
        sizeChart: {
          S: '55-56 cm',
          M: '57-58 cm',
          L: '59-60 cm',
          XL: '61-62 cm'
        }
      }
    },

    // Jackets
    {
      categoryId: catJackets.id,
      name: 'Alpinestars GP Pro V4 Jacket',
      slug: 'alpinestars-gp-pro-v4-jacket',
      description: 'A premium full-grain leather racing jacket optimized for Tech-Air 5 airbag system. Engineered for maximum protection and comfort.',
      price: 649.99,
      sku: 'AST-GPPRO-V4',
      stock: 8,
      images: ['https://images.unsplash.com/photo-1551698618-1fed5d97d256?auto=format&fit=crop&w=600&q=80'],
      isFeatured: true,
      specifications: {
        material: '1.3mm Bovine Leather',
        protection: 'CE Level 2 Armor',
        weight: '2.4kg',
        sizeChart: {
          S: '38 inch Chest',
          M: '40 inch Chest',
          L: '42 inch Chest',
          XL: '44 inch Chest'
        }
      }
    },
    {
      categoryId: catJackets.id,
      name: 'Dainese Racing 4 Leather Jacket',
      slug: 'dainese-racing-4-jacket',
      description: 'An icon of sporty street riding, the Racing 4 is built from Tutu cowhide, with composite protectors at the elbows and shoulders.',
      price: 599.99,
      sku: 'DAI-RAC4-BLK',
      stock: 14,
      images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80'],
      isFeatured: false,
      specifications: {
        material: 'Tutu Cowhide Leather',
        protection: 'CE Level 1 Armor',
        weight: '2.2kg',
        sizeChart: {
          S: '38 inch Chest',
          M: '40 inch Chest',
          L: '42 inch Chest',
          XL: '44 inch Chest'
        }
      }
    },

    // Gloves
    {
      categoryId: catGloves.id,
      name: 'Dainese Carbon 4 Long Gloves',
      slug: 'dainese-carbon-4-long-gloves',
      description: 'Certified leather racing gloves with carbon fiber knuckle protectors. Offers excellent feel, grip, and abrasion resistance.',
      price: 199.99,
      sku: 'DAI-CARB4-GLV',
      stock: 25,
      images: ['https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=600&q=80'],
      isFeatured: false,
      specifications: {
        protection: 'Carbon Fiber Knuckles',
        material: 'Goatskin Leather',
        sizeChart: {
          S: '7.5 inch Palm',
          M: '8.5 inch Palm',
          L: '9.5 inch Palm',
          XL: '10.5 inch Palm'
        }
      }
    },
    {
      categoryId: catGloves.id,
      name: 'Alpinestars GP Tech V2 Gloves',
      slug: 'alpinestars-gp-tech-v2-gloves',
      description: 'MotoGP derived racing glove containing Kevlar reinforcement and DFS knuckle protection for extreme high-speed slide resistance.',
      price: 349.99,
      sku: 'AST-GPTECH-V2',
      stock: 10,
      images: ['https://images.unsplash.com/photo-1609630875281-a83d712e5843?auto=format&fit=crop&w=600&q=80'],
      isFeatured: true,
      specifications: {
        protection: 'DFS Knuckles & Kevlar',
        material: 'Kangaroo & Goatskin',
        sizeChart: {
          S: '8 inch Palm',
          M: '9 inch Palm',
          L: '10 inch Palm',
          XL: '11 inch Palm'
        }
      }
    },

    // Pants
    {
      categoryId: catPants.id,
      name: 'Alpinestars Missile V3 Leather Pants',
      slug: 'alpinestars-missile-v3-pants',
      description: 'High-performance leather race pants featuring a pre-curved design and accordion stretch panels for ultimate track mobility.',
      price: 499.99,
      sku: 'AST-MIS3-PNT',
      stock: 7,
      images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80'],
      isFeatured: false,
      specifications: {
        material: 'Bovine Leather',
        protection: 'CE Level 2 Knee & Hip Armor',
        weight: '1.9kg',
        sizeChart: {
          S: '30 inch Waist',
          M: '32 inch Waist',
          L: '34 inch Waist',
          XL: '36 inch Waist'
        }
      }
    },
    {
      categoryId: catPants.id,
      name: 'Klim Badlands Pro Pants',
      slug: 'klim-badlands-pro-pants',
      description: 'The ultimate adventure riding pants. Constructed from Gore-Tex 3-Layer Pro Shell for absolute waterproof performance and massive ventilation.',
      price: 699.99,
      sku: 'KLM-BADPRO-PNT',
      stock: 11,
      images: ['https://images.unsplash.com/photo-1509556469415-b4bb1d1e902b?auto=format&fit=crop&w=600&q=80'],
      isFeatured: true,
      specifications: {
        material: 'Gore-Tex Pro Shell / Superfabric',
        protection: 'D3O Aero Pro Armor',
        weight: '1.7kg',
        sizeChart: {
          S: '30 inch Waist',
          M: '32 inch Waist',
          L: '34 inch Waist',
          XL: '36 inch Waist'
        }
      }
    },

    // Boots
    {
      categoryId: catBoots.id,
      name: 'Alpinestars Supertech R Boots',
      slug: 'alpinestars-supertech-r-boots',
      description: 'The pinnacle of racing boots. Features an independent biomechanical inner ankle brace, custom toe sliders, and composite protective guards.',
      price: 549.99,
      sku: 'AST-SUPR-BOT',
      stock: 9,
      images: ['https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=600&q=80'],
      isFeatured: true,
      specifications: {
        material: 'Microfiber Upper',
        protection: 'Biomechanical Ankle Brace',
        sizeChart: {
          S: 'EU 40',
          M: 'EU 42',
          L: 'EU 44',
          XL: 'EU 46'
        }
      }
    },
    {
      categoryId: catBoots.id,
      name: 'Sidi Adventure 2 Gore-Tex Boots',
      slug: 'sidi-adventure-2-boots',
      description: 'Rugged dual-sport touring boots. Combines full waterproof Gore-Tex membrane with Sidi\'s ankle pivot flex system.',
      price: 449.99,
      sku: 'SIDI-ADV2-BOT',
      stock: 15,
      images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80'],
      isFeatured: false,
      specifications: {
        material: 'Full Grain Microfibre',
        protection: 'Gore-Tex Waterproof / CE Protectors',
        sizeChart: {
          S: 'EU 40',
          M: 'EU 42',
          L: 'EU 44',
          XL: 'EU 46'
        }
      }
    },

    // Bags
    {
      categoryId: catBags.id,
      name: 'Kriega US-30 Drypack',
      slug: 'kriega-us30-drypack',
      description: '100% waterproof heavy-duty tail bag. Universal fit to any motorcycle via alloy subframe loops. Expandable and highly durable.',
      price: 189.99,
      sku: 'KRG-US30-BAG',
      stock: 20,
      images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80'],
      isFeatured: false,
      specifications: {
        capacity: '30 Liters',
        material: '420D Cordura Lite',
        weight: '1.2kg'
      }
    },

    // Accessories
    {
      categoryId: catAccessories.id,
      name: 'Cardo Packtalk Edge Duo',
      slug: 'cardo-packtalk-edge-duo',
      description: 'Premium motorcycle intercom kit containing two pre-paired units. Features JBL sound, dynamic mesh communication, and magnetic mounting.',
      price: 699.99,
      sku: 'CRD-EDGE-DUO',
      stock: 8,
      images: ['https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=600&q=80'],
      isFeatured: true,
      specifications: {
        range: '1.6 km line of sight',
        audio: 'JBL 40mm Speakers',
        waterproof: 'Fully Waterproof IP67'
      }
    },
    {
      categoryId: catAccessories.id,
      name: 'Quad Lock Handlebar Mount Pro',
      slug: 'quad-lock-handlebar-mount',
      description: 'Secure handlebar smartphone mount constructed from CNC machined black aluminum. Dampens high-frequency vibration to protect cameras.',
      price: 59.99,
      sku: 'QLK-HND-PRO',
      stock: 40,
      images: ['https://images.unsplash.com/photo-1584438784894-089d6a128f3e?auto=format&fit=crop&w=600&q=80'],
      isFeatured: false,
      specifications: {
        material: 'Anodized Aluminum',
        fitment: 'Bar sizes 22mm to 35mm'
      }
    }
  ];

  for (const prod of products) {
    await prisma.product.create({
      data: prod
    });
  }

  console.log(`Seeded ${products.length} Products`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
