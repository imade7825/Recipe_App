import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Recipe } from './entities/recipe.entity';
import { Ingredient } from './entities/ingredient.entity';
import { Category } from './entities/category.entity';
import { RecipeIngredient } from './entities/recipe-ingredient.entity';

@Module({
  imports: [
    //registers repositories for this feature
    TypeOrmModule.forFeature([Recipe, Ingredient, Category, RecipeIngredient]),
  ],
})
export class RecipesModule {}
