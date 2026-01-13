//Business-logik+TypeORM
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Recipe } from './entities/recipe.entity';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { GetRecipesFilterDto } from './dto/get-recipes-filter.dto';
import { GenerateRecipesDto } from './dto/generate-recipes.dto';

//Service kümmert sich um Datenbank-Operationen und Geschäftslogik
@Injectable()
export class RecipesService {
  constructor(
    //TypeOrm-Repository für Recipe injizieren
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
  ) {}

  //Alle Rezepte aus der Datenbank holen optional filter nutzung
  async findAll(filters: GetRecipesFilterDto): Promise<Recipe[]> {
    const { search, category, maxDuration } = filters;
    console.log('Filters in findAll:', filters);

    //QuerBuilder wird verwendet, weil find() zu eingeschränkt wäre
    const qb = this.recipeRepository
      .createQueryBuilder('recipe')
      .leftJoinAndSelect('recipe.ingredients', 'ingredient')
      .leftJoinAndSelect('recipe.categories', 'categoryEntity');

    //Falls ein Suchbegriff vorhanden ist > in Titel & Beschreibung suchen
    if (search && search.trim() !== '') {
      qb.andWhere(
        '(LOWER(recipe.title) LIKE LOWER(:search) OR LOWER(recipe.description) LIKE LOWER(:search))',
        { search: `%${search.trim()}%` },
      );
    }

    //Falls eine Kategorie übergeben wurde > nach Kategorienamen filtern
    if (category && category.trim() !== '') {
      qb.andWhere('LOWER(categoryEntity.name) = LOWER(:category)', {
        category: category.trim(),
      });
    }

    //Falls eine max. Dauer existiert > alle rezepte darunter
    if (typeof maxDuration === 'number' && !Number.isNaN(maxDuration)) {
      console.log('maxDuration-Filter wird angewendet mit:', maxDuration);
      qb.andWhere('recipe.durationMinutes <= :maxDuration', { maxDuration });
    } else {
      console.log('KEIN maxDuration-Filter aktiv, maxDuration =', maxDuration);
    }

    //Abfrage ausführen
    return qb.getMany();
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

  //Vorschlags-Logik für Rezepte(Recipe Generator)
  //Nutzt intern die bestehende Filterlogik(findAll)und wählt zufällig eine Teilmenge
  async generateSuggestions(params: GenerateRecipesDto): Promise<Recipe[]> {
    //Wir bauen aus den Generator-Parametern ein Filter-Objekt für findAll
    const filters: GetRecipesFilterDto = {
      search: undefined, //aktuell keine Volltextsuche vom Generator aus
      category: params.category,
      maxDuration: params.maxDuration,
    };

    //Alle passenden Rezepte anhand der Filter holen
    const allMatchingRecipes = await this.findAll(filters);
    if (allMatchingRecipes.length === 0) {
      //Wenn nicht passt, geben wir einfach ein leeres Array zurück
      return [];
    }
    //Limit setzen (Standard: 5 Vorschläge)
    const limit =
      typeof params.limit === 'number' && params.limit > 0 ? params.limit : 5;

    //Eine einfache Zufalls-Auswahl: Array mischen und begrenzen.
    //Hinweis: sort + Math.random ist nicht perfekt aber völlig ausreichend
    const shuffled = [...allMatchingRecipes].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, limit);
  }
}
