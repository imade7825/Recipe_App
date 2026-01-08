//Business-logik+TypeORM
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Recipe } from './entities/recipe.entity';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

//Service kümmert sich um Datenbank-Operationen und Geschäftslogik
@Injectable()
export class RecipesService {
  constructor(
    //TypeOrm-Repository für Recipe injizieren
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
  ) {}

  //Alle Rezepte aus der Datenbank holen(inkl. Relationen)
  async findAll(): Promise<Recipe[]> {
    return this.recipeRepository.find({
      relations: ['ingredients', 'categories'],
    });
  }

  //Einzelnes Rezept per ID holen
  async findOne(id: number): Promise<Recipe> {
    const recipe = await this.recipeRepository.findOne({
      where: { id },
      relations: ['ingredients', 'categories'],
    });
    if (!recipe) {
      //404 werfen, wenn nicht gefunden
      throw new NotFoundException(`Recipe with id ${id} not found`);
    }
    return recipe;
  }

  //Neues Rezept anlegen
  async create(data: CreateRecipeDto): Promise<Recipe> {
    //Entity-Instanz aus DTO erstellen (noch kein DB-Save)
    const recipe = this.recipeRepository.create(data);
    //Speichern = insert in DB
    return await this.recipeRepository.save(recipe);
  }
  //Rezept updaten(teilweise)
  async update(id: number, data: UpdateRecipeDto): Promise<Recipe> {
    //Erst sicherstellen, dass das Rezept existiert
    const recipe = await this.findOne(id);

    //Bestehende Entity mit neuen Werten überschreiben
    const updated = Object.assign(recipe, data);

    //Speichern = Update in DB
    return this.recipeRepository.save(updated);
  }

  //Rezept löschen
  async remove(id: number): Promise<void> {
    const result = await this.recipeRepository.delete(id);

    //Wenn keine Zeile betroffen war id existiert nicht
    if (result.affected === 0) {
      throw new NotFoundException(`Recipe with id ${id} not found`);
    }
  }
}
