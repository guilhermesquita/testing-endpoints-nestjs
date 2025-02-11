import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateCategoryDTO } from './dto/createCategoryDTO';
import { CategoryService } from './category.service';
import { UpdateCategoryDTO } from './dto/updateCategoryDTO';

@Controller('api/v1/categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createCategory(@Body() createCategoryDTO: CreateCategoryDTO) {
    return await this.categoryService.createCategory(createCategoryDTO);
  }
  @Get()
  async getAllCategories() {
    return await this.categoryService.getAllCategories();
  }

  @Get('/:id')
  async getCategoryById(@Param('id') id: string) {
    return await this.categoryService.getCategoryById(id);
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDTO: UpdateCategoryDTO,
  ) {
    return await this.categoryService.updateCategory(id, updateCategoryDTO);
  }

  @Post('/:category/players/:playerId')
  async assignCategoryPlayer(@Param() params: string[]) {
    await this.categoryService.assignCategoryPlayer(params);
    return 'Player assigned to category';
  }
}
