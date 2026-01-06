import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Recipe } from './recipe.entity';
import { Ingredient } from './ingredient.entity';

//join table between recipes and ingredients
@Entity('recipe_ingredients')
@Unique(['recipeId', 'ingredientId'])
export class RecipeIngredient {
  @PrimaryGeneratedColumn()
  id: number;

  //foreign key to recipe
  @Column({ name: 'recipe_id' })
  recipeId: number;

  //foreign key to ingredient
  @Column({ name: 'ingredient_id' })
  ingredientId: number;

  //quantity
  @Column({ type: 'varchar', length: 50, nullable: true })
  quantity?: string;

  //unit g, ml
  @Column({ type: 'varchar', length: 50, nullable: true })
  unit?: string;

  //relation to recipe
  @ManyToOne(() => Recipe, (recipe) => recipe.ingredients, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;

  //relation to ingredient
  @ManyToOne(() => Ingredient, (ingredient) => ingredient.recipes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ingredient_id' })
  ingredient: Ingredient;
}
