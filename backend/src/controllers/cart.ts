import { Response } from 'express';
import prisma from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';

export const getCart = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;

  try {
    const cartItems = await prisma.cartItem.findMany({
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
    return res.status(200).json(cartItems);
  } catch (error: any) {
    return res.status(500).json({ message: 'Error fetching cart', error: error.message });
  }
};

export const addToCart = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    return res.status(400).json({ message: 'Product ID is required' });
  }

  try {
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: { userId: userId!, productId }
      }
    });

    if (existingItem) {
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      });
      return res.status(200).json(updatedItem);
    }

    const newItem = await prisma.cartItem.create({
      data: {
        userId: userId!,
        productId,
        quantity
      }
    });

    return res.status(201).json(newItem);
  } catch (error: any) {
    return res.status(500).json({ message: 'Error adding to cart', error: error.message });
  }
};

export const updateCartItem = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { quantity } = req.body;
  const userId = req.user?.userId;

  if (quantity === undefined || quantity < 1) {
    return res.status(400).json({ message: 'Quantity must be at least 1' });
  }

  try {
    const item = await prisma.cartItem.findUnique({ where: { id } });
    if (!item || item.userId !== userId) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    const updated = await prisma.cartItem.update({
      where: { id },
      data: { quantity }
    });

    return res.status(200).json(updated);
  } catch (error: any) {
    return res.status(500).json({ message: 'Error updating cart item', error: error.message });
  }
};

export const removeFromCart = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;

  try {
    const item = await prisma.cartItem.findUnique({ where: { id } });
    if (!item || item.userId !== userId) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    await prisma.cartItem.delete({ where: { id } });
    return res.status(200).json({ message: 'Item removed from cart' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Error removing from cart', error: error.message });
  }
};
