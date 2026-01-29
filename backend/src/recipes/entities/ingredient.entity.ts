import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { RecipeIngredient } from './recipe-ingredient.entity';
import { IngredientGroup } from 'src/ingredients/entities/ingredient-group.entity';

@Entity('ingredients')
export class Ingredient {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'group_id', type: 'int', nullable: true })
  groupId?: number | null;

  @ManyToOne(() => IngredientGroup, (g) => g.ingredients, { nullable: true })
  //Foreign Key in ingredients heißt "groub_id"
  @JoinColumn({ name: 'group_id' })
  group?: IngredientGroup | null;

  @OneToMany(() => RecipeIngredient, (ri) => ri.ingredient)
  recipes: RecipeIngredient[];
}
