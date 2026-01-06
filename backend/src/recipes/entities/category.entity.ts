import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  Index,
} from 'typeorm';
import { Recipe } from './recipe.entity';

//represents the categories table
@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  //category name
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  //many categories belong to many recipes
  @ManyToMany(() => Recipe, (recipe) => recipe.categories)
  recipes: Recipe[];
}
