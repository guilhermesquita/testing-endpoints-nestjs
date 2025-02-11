import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './interface/category.interface';
import { Model } from 'mongoose';
import { CreateCategoryDTO } from './dto/createCategoryDTO';
import { UpdateCategoryDTO } from './dto/updateCategoryDTO';
import { PlayersService } from 'src/players/players.service';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel('Category') private categoryModel: Model<Category>,
    private readonly playersService: PlayersService,
  ) {}

  async createCategory(
    createCategoryDTO: CreateCategoryDTO,
  ): Promise<Category> {
    const { category } = createCategoryDTO;
    const existingCategory = await this.categoryModel.findOne({ category });
    if (existingCategory) {
      throw new Error(`Category ${category} already exists.`);
    }
    const createdCategory = new this.categoryModel(createCategoryDTO);
    return createdCategory.save();
  }

  async getAllCategories(): Promise<Category[]> {
    return this.categoryModel.find().exec();
  }

  async getCategoryById(id: string): Promise<Category | null> {
    const categoryFinded = await this.categoryModel
      .findById(id)
      .populate('players')
      .exec();
    if (!categoryFinded) {
      throw new NotFoundException(`Category with id ${id} not found.`);
    }
    return categoryFinded;
  }

  async updateCategory(
    id: string,
    updateCategoryDTO: UpdateCategoryDTO,
  ): Promise<Category | null> {
    const categoryFinded = await this.categoryModel
      .findByIdAndUpdate(id, updateCategoryDTO, { new: true })
      .exec();
    if (!categoryFinded) {
      throw new NotFoundException(`Category with id ${id} not found.`);
    }
    return categoryFinded;
  }

  async getCategoryByPlayer(player: string): Promise<Category | null> {
    const categoryFinded = await this.categoryModel
      .findOne({ players: player })
      .exec();
    if (!categoryFinded) {
      throw new NotFoundException(`Player with id ${player} not found.`);
    }
    return categoryFinded;
  }

  async assignCategoryPlayer(params: string[]) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const category = params['category'];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const playerId = params['playerId'];

    const categoryFinded = await this.categoryModel.findOne({ category });
    if (!categoryFinded) {
      throw new NotFoundException(`Category with id ${category} not found.`);
    }

    const playerRegistredInCategory = await this.categoryModel
      .find({ category })
      .where('players')
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      .in(playerId)
      .exec();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const playerFinded = await this.playersService.getPlayerById(playerId);
    if (!playerFinded) {
      throw new NotFoundException(`Player with id ${playerId} not found.`);
    }

    if (playerRegistredInCategory.length > 0) {
      throw new BadRequestException(
        `Player ${playerId} is already assigned to category ${category}.`,
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    categoryFinded.players.push(playerId);
    await this.categoryModel
      .findOneAndUpdate({ category }, { $set: categoryFinded })
      .exec();

    return categoryFinded;
  }
}
