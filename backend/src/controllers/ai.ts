import { Request, Response } from 'express';
import prisma from '../config/db';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

// Helper to make requests to OpenAI
const callOpenAI = async (messages: any[]) => {
  if (!OPENAI_API_KEY) {
    // Fallback Mock Response if API key is not configured
    const lastMessage = messages[messages.length - 1]?.content || '';
    return `[MOCK AI RESPONSE] I am your RideX Gear Assistant. To enable live AI recommendations, please add your OPENAI_API_KEY to the backend .env file. (Replying to: "${lastMessage.substring(0, 30)}...")`;
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.7,
        max_tokens: 800
      })
    });

    const data = (await response.json()) as any;
    if (!response.ok) {
      throw new Error(data.error?.message || 'OpenAI API Error');
    }
    return data.choices[0].message.content;
  } catch (error: any) {
    console.error('OpenAI Integration Error:', error.message);
    return `I apologize, but I am having trouble connecting to my cognitive services right now. (Error: ${error.message})`;
  }
};

export const chatWithAssistant = async (req: Request, res: Response) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ message: 'Messages array is required' });
  }

  try {
    // 1. Fetch active catalog to inject as context
    const products = await prisma.product.findMany({
      where: { isArchived: false },
      select: {
        name: true,
        slug: true,
        price: true,
        stock: true,
        category: { select: { name: true } }
      }
    });

    const productCatalogContext = products
      .map(p => `- ${p.name} ($${p.price}, Category: ${p.category.name}, Slug: ${p.slug}, Stock: ${p.stock})`)
      .join('\n');

    // 2. Build system instructions
    const systemInstruction = {
      role: 'system',
      content: `You are the RideX Elite Gear Expert, a helpful and knowledgeable motorcycle gear advisor. 
Your goal is to guide riders in selecting the best helmets, jackets, gloves, and accessories.

Here is the current RideX Product Catalog:
${productCatalogContext}

Guidelines:
1. Recommend ONLY products from the catalog above. Do not hallucinate products we do not sell.
2. Provide direct product links using the markdown format: [Product Name](/products/slug). For example: [Shoei X-Fifteen Helmet](/products/shoei-x-fifteen-helmet).
3. Keep your tone professional, encouraging, and focused on rider safety and performance.
4. If a product is out of stock (Stock: 0), mention that we are currently restocking it, but suggest an alternative.`
    };

    const fullMessages = [systemInstruction, ...messages];
    const aiResponse = await callOpenAI(fullMessages);

    return res.status(200).json({ response: aiResponse });
  } catch (error: any) {
    return res.status(500).json({ message: 'AI Chat Error', error: error.message });
  }
};

export const compareProducts = async (req: Request, res: Response) => {
  const { productIds } = req.body;

  if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
    return res.status(400).json({ message: 'productIds array is required' });
  }

  try {
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { category: { select: { name: true } } }
    });

    if (products.length === 0) {
      return res.status(404).json({ message: 'No matching products found for comparison' });
    }

    const productsData = products.map(p => ({
      name: p.name,
      category: p.category.name,
      price: `$${p.price}`,
      description: p.description,
      specifications: p.specifications
    }));

    const systemInstruction = {
      role: 'system',
      content: 'You are a technical gear analyst. Your job is to compare the provided products side-by-side. Output a clean, detailed Markdown comparison matrix comparing their features, safety specs, materials, and value. Conclude with a summary recommending which product is best suited for different types of riders.'
    };

    const userMessage = {
      role: 'user',
      content: `Compare these products:\n${JSON.stringify(productsData, null, 2)}`
    };

    const aiResponse = await callOpenAI([systemInstruction, userMessage]);
    return res.status(200).json({ comparison: aiResponse });
  } catch (error: any) {
    return res.status(500).json({ message: 'AI Comparison Error', error: error.message });
  }
};

export const recommendGear = async (req: Request, res: Response) => {
  const { ridingStyle, budget, weatherCondition } = req.body;

  if (!ridingStyle) {
    return res.status(400).json({ message: 'ridingStyle is required' });
  }

  try {
    const products = await prisma.product.findMany({
      where: { isArchived: false },
      include: { category: { select: { name: true } } }
    });

    const catalog = products.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      category: p.category.name,
      slug: p.slug
    }));

    const systemInstruction = {
      role: 'system',
      content: 'You are a professional motorcycle riding instructor. Based on the rider\'s profile, recommend a cohesive set of gears from our catalog. You must structure the recommendation with sections for Helmets, Jackets, and Gloves, explaining why each item fits their style.'
    };

    const userMessage = {
      role: 'user',
      content: `Rider Profile:
- Riding Style: ${ridingStyle} (e.g., track, touring, adventure, urban)
- Budget: ${budget ? `$${budget}` : 'Any'}
- Weather: ${weatherCondition || 'All-weather'}

Available Catalog:
${JSON.stringify(catalog, null, 2)}`
    };

    const aiResponse = await callOpenAI([systemInstruction, userMessage]);
    return res.status(200).json({ recommendations: aiResponse });
  } catch (error: any) {
    return res.status(500).json({ message: 'AI Recommendation Error', error: error.message });
  }
};

export const recommendSize = async (req: Request, res: Response) => {
  const { productId, height, weight, chest, waist } = req.body;

  if (!productId || !chest) {
    return res.status(400).json({ message: 'productId and chest measurement are required' });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { name: true, specifications: true }
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const sizeChart = (product.specifications as any)?.sizeChart || 'No explicit size chart available. Default to standard sizing.';

    const systemInstruction = {
      role: 'system',
      content: `You are an expert tailor for motorcycle gear. Your task is to recommend the perfect fit size (e.g., S, M, L, XL, XXL) based on the user's measurements and the product's size chart. 
You must respond with a JSON object containing exactly these fields:
{
  "recommendedSize": "string",
  "confidence": "low" | "medium" | "high",
  "explanation": "string explaining why and detailing any tight spots or fit preferences"
}`
    };

    const userMessage = {
      role: 'user',
      content: `Product: ${product.name}
Size Chart:
${JSON.stringify(sizeChart, null, 2)}

User Measurements:
- Height: ${height || 'Not provided'}
- Weight: ${weight || 'Not provided'}
- Chest: ${chest} inches
- Waist: ${waist || 'Not provided'} inches`
    };

    const aiResponse = await callOpenAI([systemInstruction, userMessage]);

    // Attempt to parse JSON response. If it fails, wrap it in a JSON structure.
    try {
      const parsed = JSON.parse(aiResponse);
      return res.status(200).json(parsed);
    } catch (e) {
      return res.status(200).json({
        recommendedSize: 'Refer to chart',
        confidence: 'medium',
        explanation: aiResponse
      });
    }
  } catch (error: any) {
    return res.status(500).json({ message: 'AI Size Error', error: error.message });
  }
};
