import { Request, Response } from 'express';
import prisma from '../config/db';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        children: true
      }
    });
    // Filter top-level categories
    const rootCategories = categories.filter(cat => !cat.parentId);
    return res.status(200).json(rootCategories);
  } catch (error: any) {
    return res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  const { name, slug, description, imageUrl, parentId } = req.body;

  if (!name || !slug) {
    return res.status(400).json({ message: 'Name and slug are required' });
  }

  try {
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      return res.status(400).json({ message: 'Category with this slug already exists' });
    }

    const category = await prisma.category.create({
      data: { name, slug, description, imageUrl, parentId }
    });

    return res.status(201).json(category);
  } catch (error: any) {
    return res.status(500).json({ message: 'Error creating category', error: error.message });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, slug, description, imageUrl, parentId } = req.body;

  try {
    const category = await prisma.category.update({
      where: { id },
      data: { name, slug, description, imageUrl, parentId }
    });

    return res.status(200).json(category);
  } catch (error: any) {
    return res.status(500).json({ message: 'Error updating category', error: error.message });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Find all products in this category
    const products = await prisma.product.findMany({ where: { categoryId: id } });
    const productIds = products.map(p => p.id);

    if (productIds.length > 0) {
      // 1. Delete reviews for these products
      await prisma.productReview.deleteMany({ where: { productId: { in: productIds } } });
      // 2. Delete cart items referencing these products
      await prisma.cartItem.deleteMany({ where: { productId: { in: productIds } } });
      // 3. Delete wishlist items referencing these products
      await prisma.wishlistItem.deleteMany({ where: { productId: { in: productIds } } });
      // 4. Delete order items referencing these products
      await prisma.orderItem.deleteMany({ where: { productId: { in: productIds } } });
      // 5. Delete products
      await prisma.product.deleteMany({ where: { categoryId: id } });
    }

    // 6. Delete category
    await prisma.category.delete({ where: { id } });
    return res.status(200).json({ message: 'Category and all associated products deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Error deleting category and products', error: error.message });
  }
};
