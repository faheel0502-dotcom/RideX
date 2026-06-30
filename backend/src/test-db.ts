import prisma from './config/db';

async function test() {
  console.log('Database URL configured:', process.env.DATABASE_URL ? 'YES' : 'NO');
  try {
    console.log('Querying categories...');
    const cats = await prisma.category.findMany();
    console.log(`Success: Found ${cats.length} categories.`);
    
    console.log('Querying products...');
    const prods = await prisma.product.findMany();
    console.log(`Success: Found ${prods.length} products.`);
  } catch (err: any) {
    console.error('Database query failed:', err.message);
  } finally {
    await prisma.$disconnect();
    console.log('Disconnected.');
  }
}

test();
