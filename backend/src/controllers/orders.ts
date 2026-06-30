import { Request, Response } from 'express';
import prisma from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';

export const checkout = async (req: AuthenticatedRequest, res: Response) => {
  const { items, shippingAddress, paymentMethod = 'RAZORPAY' } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Cart items are required' });
  }

  if (!shippingAddress) {
    return res.status(400).json({ message: 'Shipping address is required' });
  }

  try {
    let totalAmount = 0;
    const orderItemsData: { productId: string; quantity: number; priceAtPurchase: number }[] = [];


    // Verify stock and calculate total
    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}. Available: ${product.stock}` });
      }

      const price = Number(product.price);
      totalAmount += price * item.quantity;

      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        priceAtPurchase: price
      });
    }

    const taxAmount = totalAmount * 0.18; // 18% GST/tax
    const shippingAmount = totalAmount > 150 ? 0 : 15; // Free shipping over $150
    const finalTotal = totalAmount + taxAmount + shippingAmount;

    // Generate unique order number
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `RDX-${dateStr}-${randomSuffix}`;

    // Execute order creation, stock decrement, and cart clearing in a single transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          orderNumber,
          totalAmount: finalTotal,
          taxAmount,
          shippingAmount,
          paymentMethod,
          paymentStatus: 'PENDING',
          status: 'PENDING',
          shippingStreet: shippingAddress.street,
          shippingCity: shippingAddress.city,
          shippingState: shippingAddress.state,
          shippingZip: shippingAddress.zip,
          shippingCountry: shippingAddress.country,
          shippingPhone: shippingAddress.phone,
          gatewayOrderId: paymentMethod === 'RAZORPAY' ? `rzp_order_${Math.random().toString(36).substring(2, 15)}` : null,
          orderItems: {
            create: orderItemsData
          }
        },
        include: {
          orderItems: true
        }
      });

      // Decrement product stocks
      for (const item of orderItemsData) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }

      // Clear user's active cart items
      await tx.cartItem.deleteMany({ where: { userId } });

      return newOrder;
    });

    return res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Error during checkout', error: error.message });
  }
};

export const verifyPayment = async (req: AuthenticatedRequest, res: Response) => {
  const { orderId, gatewayPaymentId, gatewaySignature, success = true } = req.body;

  try {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (success) {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'COMPLETED',
          status: 'PAID',
          gatewayPaymentId: gatewayPaymentId || `pay_${Math.random().toString(36).substring(2, 15)}`,
          gatewaySignature: gatewaySignature || `sig_${Math.random().toString(36).substring(2, 15)}`
        }
      });
      return res.status(200).json({ message: 'Payment verified and order completed' });
    } else {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'FAILED'
        }
      });
      return res.status(400).json({ message: 'Payment verification failed' });
    }
  } catch (error: any) {
    return res.status(500).json({ message: 'Error verifying payment', error: error.message });
  }
};

export const getUserOrders = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;

  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: {
            product: {
              select: { name: true, images: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json(orders);
  } catch (error: any) {
    return res.status(500).json({ message: 'Error fetching user orders', error: error.message });
  }
};

export const getOrderDetails = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId !== userId && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden: Access denied' });
    }

    return res.status(200).json(order);
  } catch (error: any) {
    return res.status(500).json({ message: 'Error fetching order details', error: error.message });
  }
};

export const adminGetOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: { email: true, firstName: true, lastName: true }
        },
        orderItems: {
          include: {
            product: {
              select: { name: true, images: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json(orders);
  } catch (error: any) {
    return res.status(500).json({ message: 'Error fetching all orders', error: error.message });
  }
};

export const adminUpdateOrderStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, trackingNumber } = req.body;

  try {
    const order = await prisma.order.update({
      where: { id },
      data: {
        status,
        trackingNumber
      }
    });
    return res.status(200).json(order);
  } catch (error: any) {
    return res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
};
