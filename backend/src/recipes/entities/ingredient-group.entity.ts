import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
} from 'typeorm';
import { Ingredient } from './ingredient.entity';

@Entity('ingredient_groups')
export class IngredientGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @OneToMany(() => Ingredient, (ingredient) => ingredient.group)
  ingredients: Ingredient[];
}
