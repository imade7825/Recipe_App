//service enthält Business-Logik / DB Queries

//Injectable macht diese Klasse per Nest DI "injectabel" (Dependency Injection)
import { Injectable } from '@nestjs/common';

//InjectRepository erlaubt uns, TypeORM Repostories in den Constructor zu injizieren
import { InjectRepository } from '@nestjs/typeorm';

//Repository ist das TypeORM Objekt, womit wir DB-Abfragen machen (find, save, etc..)
import { Repository } from 'typeorm';

//Wir brauchen, die Entity, weil wir Gruppen aus DB laden wollen
import { IngredientGroup } from './entities/ingredient-group.entity';

//markiert die Klasse als Nest Provider (Service)
@Injectable()
export class IngredientsService {
  constructor(
    //sagt Nest/TypeORM: gib mir das Repository für IngredientGroup
    @InjectRepository(IngredientGroup)
    //groupRepo ist das DB-Zugriffsobjekt für IngredientGroup
    private readonly groupRepo: Repository<IngredientGroup>,
  ) {}

  //async weil DB-Abfrage ein Promise ist
  async getGrouped() {
    //find() lädt Daten aus ingredient_groups
    return this.groupRepo.find({
      //relations lädt automatisch die verknüpften Ingredients mit (JOIN)
      relations: ['ingredients'],
      order: { name: 'ASC' },
    });
  }
}
