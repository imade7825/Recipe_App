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
    // Wir lesen alle Filter aus dem DTO raus
    const { search, category, maxDuration, ingredientIds, maxMissing } =
      filters;

    // Debug-Log: zeigt dir, welche Filter wirklich ankommen
    console.log('Filters in findAll:', filters);

    // 1) ERSTER QUERY: wir holen zuerst nur die IDs der passenden Rezepte
    //    (das ist wichtig, weil HAVING/COUNT Filter sonst mit relations + joins schnell kaputt gehen kann)
    const idsQb = this.recipeRepository
      // QueryBuilder auf der Tabelle "recipes" mit Alias "recipe"
      .createQueryBuilder('recipe')
      // WICHTIG: join auf recipe.ingredients mit Alias "ri" (RecipeIngredient)
      // Wir brauchen das später für COUNT / HAVING
      .leftJoin('recipe.ingredients', 'ri')
      // Join auf categories (für category Filter)
      .leftJoin('recipe.categories', 'categoryEntity')
      // Wir selektieren nur die ID, damit der Query "leicht" bleibt
      .select('recipe.id', 'id')
      // GroupBy ist Pflicht, weil wir COUNT/HAVING machen
      .groupBy('recipe.id');

    // 2) SEARCH Filter: Titel oder Beschreibung enthält "search"
    if (search && search.trim() !== '') {
      idsQb.andWhere(
        '(LOWER(recipe.title) LIKE LOWER(:search) OR LOWER(recipe.description) LIKE LOWER(:search))',
        { search: `%${search.trim()}%` },
      );
    }

    // 3) CATEGORY Filter: exakter Kategoriename (case-insensitive)
    if (category && category.trim() !== '') {
      idsQb.andWhere('LOWER(categoryEntity.name) = LOWER(:category)', {
        category: category.trim(),
      });
    }

    // 4) maxDuration Filter: nur Rezepte <= maxDuration Minuten
    if (typeof maxDuration === 'number' && !Number.isNaN(maxDuration)) {
      idsQb.andWhere('recipe.durationMinutes <= :maxDuration', { maxDuration });
    }

    // 5) Ingredient-Filter mit "maxMissing":
    //    Idee: Missing = totalIngredients - matchedIngredients
    //    -> Missing muss <= maxMissing sein
    if (ingredientIds && ingredientIds.length > 0) {
      // Wenn maxMissing nicht gesetzt ist, nehmen wir Standard = 2
      const maxIngredientMissing =
        typeof maxMissing === 'number' && !Number.isNaN(maxMissing)
          ? maxMissing
          : 2;

      // matched = wie viele Zutaten des Rezepts sind in ingredientIds enthalten
      idsQb.addSelect(
        `COUNT(DISTINCT CASE WHEN ri.ingredientId IN (:...ingredientIds) THEN ri.ingredientId END)`,
        'matched',
      );

      // total = wie viele Zutaten hat das Rezept insgesamt
      idsQb.addSelect(`COUNT(DISTINCT ri.ingredientId)`, 'total');

      // HAVING: (total - matched) <= maxMissing
      idsQb.having(
        `(COUNT(DISTINCT ri.ingredientId) - COUNT(DISTINCT CASE WHEN ri.ingredientId IN (:...ingredientIds) THEN ri.ingredientId END)) <= :maxMissing`,
        { ingredientIds, maxMissing: maxIngredientMissing },
      );
    }

    // 6) Query ausführen -> Rohdaten (nur IDs)
    const rows = await idsQb.getRawMany<{ id: string }>();

    // IDs sauber in number umwandeln
    const ids = rows.map((row) => Number(row.id)).filter(Number.isFinite);

    // Wenn keine IDs gefunden wurden -> leeres Ergebnis
    if (ids.length === 0) return [];

    // 7) ZWEITER QUERY: Jetzt laden wir die echten Rezept-Objekte inkl. Relations
    const qb = this.recipeRepository
      // QueryBuilder wieder auf recipes
      .createQueryBuilder('recipe')
      // Zutaten-Relation laden
      .leftJoinAndSelect('recipe.ingredients', 'ingredients')
      // Kategorien-Relation laden (WICHTIG: richtig geschrieben!)
      .leftJoinAndSelect('recipe.categories', 'categories')
      // nur die IDs, die wir vorher bestimmt haben
      .where('recipe.id IN (:...ids)', { ids });

    // 8) Fertige Rezepte zurückgeben
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
