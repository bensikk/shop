import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать новую категорию' })
  @ApiResponse({ status: 201, description: 'Категория создана' })
  create(@Body() createCategoryDto: any) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить все категории' })
  @ApiResponse({ status: 200, description: 'Список категорий' })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить категорию по ID' })
  @ApiResponse({ status: 200, description: 'Категория найдена' })
  @ApiResponse({ status: 404, description: 'Категория не найдена' })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить категорию' })
  @ApiResponse({ status: 200, description: 'Категория обновлена' })
  update(@Param('id') id: string, @Body() updateCategoryDto: any) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить категорию' })
  @ApiResponse({ status: 200, description: 'Категория удалена' })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
