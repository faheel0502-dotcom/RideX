import { Response } from 'express';
import prisma from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';

export const getWishlist = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;

  try {
    const wishlist = await prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            images: true,
            stock: true
          }
        }
      }
    });
    return res.status(200).json(wishlist);
  } catch (error: any) {
    return res.status(500).json({ message: 'Error fetching wishlist', error: error.message });
  }
};

export const addToWishlist = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ message: 'Product ID is required' });
  }

  try {
    const existing = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: { userId: userId!, productId }
      }
    });

    if (existing) {
      return res.status(400).json({ message: 'Item already in wishlist' });
    }

    const item = await prisma.wishlistItem.create({
      data: { userId: userId!, productId }
    });

    return res.status(201).json(item);
  } catch (error: any) {
    return res.status(500).json({ message: 'Error adding to wishlist', error: error.message });
  }
};

export const removeFromWishlist = async (req: AuthenticatedRequest, res: Response) => {
  const { productId } = req.params;
  const userId = req.user?.userId;

  try {
    await prisma.wishlistItem.delete({
      where: {
        userId_productId: { userId: userId!, productId }
      }
    });
    return res.status(200).json({ message: 'Item removed from wishlist' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Error removing from wishlist', error: error.message });
  }
};
