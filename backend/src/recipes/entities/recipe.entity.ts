import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { RecipeIngredient } from './recipe-ingredient.entity';
import { Category } from './category.entity';

//this class represents the "recipes" table in the database
@Entity('recipes')
export class Recipe {
  //auto increment primary key
  @PrimaryGeneratedColumn()
  id: number;

  //recipe title (required)
  @Column({ type: 'varchar', length: 255 })
  title: string;

  //optional description
  @Column({ type: 'text', nullable: true })
  description?: string;

  //cooking instructions(required)
  @Column({ type: 'text' })
  instructions: string;

  //cooking duration in min
  @Column({ type: 'int' })
  durationMinutes: number;

  //optional image URL
  @Column({ type: 'varchar', length: 2084, nullable: true })
  imageUrl?: string;

  //one recipe has many ingredients(with guantity/unit)
  @OneToMany(() => RecipeIngredient, (ri) => ri.recipe, { cascade: true })
  ingredients: RecipeIngredient[];

  //many recipes can have many categories
  @ManyToMany(() => Category, (category) => category.recipes, { cascade: true })
  @JoinTable({
    name: 'recipe_categories',
    joinColumn: { name: 'recipe_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories: Category[];

  //auto-generated timestamps
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
