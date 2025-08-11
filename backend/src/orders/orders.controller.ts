import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Создать новый заказ' })
  @ApiResponse({ status: 201, description: 'Заказ создан' })
  create(@Body() createOrderDto: any, @Request() req: any) {
    return this.ordersService.create(createOrderDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Получить заказы пользователя' })
  @ApiResponse({ status: 200, description: 'Список заказов' })
  findAll(@Request() req: any) {
    return this.ordersService.findAll(req.user.id);
  }

  @Get('admin')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Получить все заказы (только для админов)' })
  @ApiResponse({ status: 200, description: 'Список всех заказов' })
  findAllAdmin() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить заказ по ID' })
  @ApiResponse({ status: 200, description: 'Заказ найден' })
  @ApiResponse({ status: 404, description: 'Заказ не найден' })
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.ordersService.findOne(+id, req.user.role === 'ADMIN' ? undefined : req.user.id);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Обновить статус заказа' })
  @ApiResponse({ status: 200, description: 'Статус заказа обновлен' })
  updateStatus(@Param('id') id: string, @Body() updateStatusDto: { status: string }) {
    return this.ordersService.updateStatus(+id, updateStatusDto.status);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Удалить заказ' })
  @ApiResponse({ status: 200, description: 'Заказ удален' })
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
