//importiert TypeOrm decorators, damit wir Tabellen/Spalte/Relationen definieren können
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
} from 'typeorm';

//wir benutzen ingredient, weil eine Gruppe viele Ingredients hat (Relation)
import { Ingredient } from 'src/recipes/entities/ingredient.entity';

//Klasse mappt auf die DB-Tabelle "ingredient_groups"
@Entity('ingredient_groups')
export class IngredientGroup {
  //erzeugt eine auto-increment primary key spalte "id"
  @PrimaryGeneratedColumn()
  id: number;
  //erstellt einen unique index für "name"(name darf nur einmal existieren)
  @Index({ unique: true })
  //db spalte "name als text mit max länge 255"
  @Column({ type: 'varchar', length: 255 })
  name: string;

  //eine gruppe hat viele ingredients
  // () => ingredient sagt, welche ziel entity
  // (ingredient) => ingredient.group sagt: Gegenrichtung liegt in Ingredient.group
  @OneToMany(() => Ingredient, (ingredient) => ingredient.group)
  ingredients: Ingredient[];
}
