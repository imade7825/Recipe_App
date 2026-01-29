//Module erstellt den "Container für alles rund um Ingredients"

//Module ist der Nest Decorator für Feature-Module
import { Module } from '@nestjs/common';

//TypeOrmModule.forFeature(...) registriert Repositories für Entities in diesem Modul
import { TypeOrmModule } from '@nestjs/typeorm';

//wir registrieren das Repository für IngredientGroup
import { IngredientGroup } from './entities/ingredient-group.entity';

//Controller derfiniert die HTTP-Routen
import { IngredientsController } from './ingredients.controller';

//Service enthält die DB-Logik
import { IngredientsService } from './ingredients.service';

@Module({
  //macht groupRepo in IngredientsService verfügbar
  imports: [TypeOrmModule.forFeature([IngredientGroup])],
  //sagt Nest: dieser Controller/Service gehören zu diesem Moul
  controllers: [IngredientsController],
  providers: [IngredientsService],
})
//export, damit AppModule es importieren können
export class IngredientsModule {}
