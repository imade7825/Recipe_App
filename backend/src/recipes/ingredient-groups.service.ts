import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IngredientGroup } from 'src/ingredients/entities/ingredient-group.entity';

@Injectable()
export class IngredientGroupService {
  constructor(
    @InjectRepository(IngredientGroup)
    private readonly groupRepo: Repository<IngredientGroup>,
  ) {}

  findAllWithIngredients() {
    return this.groupRepo.find({
      relations: ['ingredients'],
      order: { name: 'ASC' },
    });
  }
}
