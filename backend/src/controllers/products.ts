import { Request, Response } from 'express';
import prisma from '../config/db';

export const getProducts = async (req: Request, res: Response) => {
  const { search, category, minPrice, maxPrice, sort, page = '1', limit = '10' } = req.query;

  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const skip = (pageNum - 1) * limitNum;

  // Build Prisma filter query
  const where: any = {
    isArchived: false
  };

  if (search) {
    where.OR = [
      { name: { contains: search as string, mode: 'insensitive' } },
      { description: { contains: search as string, mode: 'insensitive' } }
    ];
  }

  if (category) {
    where.category = {
      slug: category as string
    };
  }

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) {
      where.price.gte = parseFloat(minPrice as string);
    }
    if (maxPrice) {
      where.price.lte = parseFloat(maxPrice as string);
    }
  }

  // Sorting
  let orderBy: any = { createdAt: 'desc' };
  if (sort) {
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    else if (sort === 'price_desc') orderBy = { price: 'desc' };
    else if (sort === 'rating') orderBy = { rating: 'desc' };
  }

  try {
    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limitNum,
        include: {
          category: {
            select: { name: true, slug: true }
          }
        }
      }),
      prisma.product.count({ where })
    ]);

    return res.status(200).json({
      products,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

export const getProductBySlug = async (req: Request, res: Response) => {
  const { slug } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: {
          select: { id: true, name: true, slug: true }
        },
        reviews: {
          include: {
            user: {
              select: { firstName: true, lastName: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!product || product.isArchived) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json(product);
  } catch (error: any) {
    return res.status(500).json({ message: 'Error fetching product details', error: error.message });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  const { categoryId, name, slug, description, price, compareAtPrice, sku, stock, images, specifications, isFeatured } = req.body;

  if (!categoryId || !name || !slug || !price || !sku) {
    return res.status(400).json({ message: 'Required fields: categoryId, name, slug, price, sku' });
  }

  try {
    const existingSku = await prisma.product.findUnique({ where: { sku } });
    if (existingSku) {
      return res.status(400).json({ message: 'Product with this SKU already exists' });
    }

    const existingSlug = await prisma.product.findUnique({ where: { slug } });
    if (existingSlug) {
      return res.status(400).json({ message: 'Product with this slug already exists' });
    }

    const product = await prisma.product.create({
      data: {
        categoryId,
        name,
        slug,
        description,
        price,
        compareAtPrice,
        sku,
        stock: stock || 0,
        images: images || [],
        specifications: specifications || {},
        isFeatured: isFeatured || false
      }
    });

    return res.status(201).json(product);
  } catch (error: any) {
    return res.status(500).json({ message: 'Error creating product', error: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { categoryId, name, slug, description, price, compareAtPrice, sku, stock, images, specifications, isFeatured, isArchived } = req.body;

  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        categoryId,
        name,
        slug,
        description,
        price,
        compareAtPrice,
        sku,
        stock,
        images,
        specifications,
        isFeatured,
        isArchived
      }
    });

    return res.status(200).json(product);
  } catch (error: any) {
    return res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Soft delete to preserve order reference integrity
    await prisma.product.update({
      where: { id },
      data: { isArchived: true }
    });

    return res.status(200).json({ message: 'Product archived successfully' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Error archiving product', error: error.message });
  }
};
