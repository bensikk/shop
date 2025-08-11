import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: any) {
    return this.prisma.product.create({
      data: createProductDto,
      include: {
        category: true,
      },
    });
  }

  async findAll(query?: any) {
    const where: any = {
      isActive: true,
    };

    if (query?.categoryId && query.categoryId !== '') {
      where.categoryId = parseInt(query.categoryId as string, 10);
    }

    if (query?.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
        { brand: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query?.minPrice && query.minPrice !== '') {
      where.price = { gte: parseFloat(query.minPrice as string) };
    }

    if (query?.maxPrice && query.maxPrice !== '') {
      if (where.price) {
        where.price = { ...where.price, lte: parseFloat(query.maxPrice as string) };
      } else {
        where.price = { lte: parseFloat(query.maxPrice as string) };
      }
    }

    const products = await this.prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return products;
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Товар не найден');
    }

    return product;
  }

  async update(id: number, updateProductDto: any) {
    await this.findOne(id);

    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
      include: {
        category: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async updateStock(id: number, quantity: number) {
    const product = await this.findOne(id);
    
    if (product.stock < quantity) {
      throw new Error('Недостаточно товара на складе');
    }

    return this.prisma.product.update({
      where: { id },
      data: { stock: product.stock - quantity },
    });
  }
}
