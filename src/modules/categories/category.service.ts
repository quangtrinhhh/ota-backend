import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository } from "typeorm";
import { CreateCategoryDto } from "./dto/createCategory.dto";
import { UpdateCategoryDto } from "./dto/updateCategory.dto";
import { CategoryEntity } from "src/entities/category.entity";
import { Category } from "src/models/category.model";

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(CategoryEntity)
        private readonly categoryRepository: Repository<CategoryEntity>
    ) { }

    async getCategories(): Promise<Category[]> {
        const categories = await this.categoryRepository.find();
        return categories.map(category => new Category(category.id, category.name, category.description, category.hotel_id));
    }

    async getCategoriesByHotelId(hotel_id: number): Promise<Category[]> {
        const categories = await this.categoryRepository.find({ where: { hotel_id } });
        return categories.map(category => new Category(category.id, category.name, category.description, category.hotel_id));
    }

    async findOneCategory(id: number): Promise<Category> {
        const category = await this.categoryRepository.findOne({ where: { id } });
        return new Category(category.id, category.name, category.description, category.hotel_id);
    }

    async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
        const category = new Category();
        category.name = createCategoryDto.name;
        category.description = createCategoryDto.description;
        category.hotel_id = createCategoryDto.hotel_id;

        await this.categoryRepository.save(category);
        return new Category(category.id, category.name, category.description, category.hotel_id);

    }

    async updateCategory(updateCategoryDto: UpdateCategoryDto): Promise<Category> {
        const { id, ...updateCategoryData } = updateCategoryDto;

        await this.categoryRepository.update(id, updateCategoryData);

        const category = await this.categoryRepository.findOne({ where: { id } })
        return new Category(category.id, category.name, category.description, category.hotel_id);
    }

    async deleteCategory(id: number): Promise<string> {
        await this.categoryRepository.delete(id);
        return `Delete category ${id} success`;
    }


    async getCategoriesByHotelIdAdmin(
        hotel_id: number,
        search: string
    ): Promise<Category[]> {
        const whereCondition: any = {
            hotel_id,
        }
        if (search) {
            whereCondition.name = Like(`%${search}%`);
        }
        const categories = await this.categoryRepository.find({ where: whereCondition });
        return categories.map(category => new Category(category.id, category.name, category.description, category.hotel_id));
    }
}