import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Recipe } from './entities/recipe.entity';
import { Ingredient } from './entities/ingredient.entity';
import { Category } from './entities/category.entity';
import { RecipeIngredient } from './entities/recipe-ingredient.entity';

import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';

//Bündelt alles rund um Rezepte
@Module({
  imports: [
    //registers repositories for this feature
    TypeOrmModule.forFeature([Recipe, Ingredient, Category, RecipeIngredient]),
  ],
  controllers: [RecipesController],
  providers: [RecipesService],
})
export class RecipesModule {}
