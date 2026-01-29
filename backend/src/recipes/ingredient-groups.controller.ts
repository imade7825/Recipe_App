import { Controller, Get } from '@nestjs/common';
import { IngredientGroupService } from './ingredient-groups.service';

@Controller('ingredient-groups')
export class IngredientGroupController {
  constructor(private readonly service: IngredientGroupService) {}

  @Get()
  findAll() {
    return this.service.findAllWithIngredients();
  }
}
