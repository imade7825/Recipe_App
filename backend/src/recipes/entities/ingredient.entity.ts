import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
} from 'typeorm';
import { RecipeIngredient } from './recipe-ingredient.entity';

//represents the ingredients table
@Entity('ingredients')
export class Ingredient {
  @PrimaryGeneratedColumn()
  id: number;

  //Ingredient name should be unique
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  //one ingredient can appear in many recipes
  @OneToMany(() => RecipeIngredient, (ri) => ri.ingredient)
  recipes: RecipeIngredient[];
}
