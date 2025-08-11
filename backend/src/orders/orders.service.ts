import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductsService } from '../products/products.service';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private productsService: ProductsService,
  ) {}

  async create(createOrderDto: any, userId: number) {
    const { items, ...orderData } = createOrderDto;
    
    // Підраховуємо загальну суму замовлення
    let total = new Decimal(0);
    const orderItems = [];

    for (const item of items) {
      const product = await this.productsService.findOne(item.productId);
      const itemTotal = new Decimal(product.price).mul(item.quantity);
      total = total.add(itemTotal);
      
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Створюємо замовлення з елементами
    const order = await this.prisma.order.create({
      data: {
        ...orderData,
        userId,
        total,
        orderItems: {
          create: orderItems,
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Оновлюємо залишки товарів
    for (const item of items) {
      await this.productsService.updateStock(item.productId, item.quantity);
    }

    return order;
  }

  async findAll(userId?: number) {
    const where: any = {};
    
    if (userId) {
      where.userId = userId;
    }

    return this.prisma.order.findMany({
      where,
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number, userId?: number) {
    const where: any = { id };
    
    if (userId) {
      where.userId = userId;
    }

    const order = await this.prisma.order.findFirst({
      where,
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Заказ не найден');
    }

    return order;
  }

  async updateStatus(id: number, status: any) {
    await this.findOne(id);

    return this.prisma.order.update({
      where: { id },
      data: { status },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    // Спочатку видаляємо всі пов'язані orderItems
    await this.prisma.orderItem.deleteMany({
      where: { orderId: id },
    });

    // Потім видаляємо сам замовлення
    return this.prisma.order.delete({
      where: { id },
    });
  }
}
