//controller definiert HTTP-Routen (z.B. GET /ingredients/grouped)

//Controller markiert die Klasse als API Controller
//Get definiert eine GET Route
import { Controller, Get } from '@nestjs/common';

//Wir brauchen den Service, um die DB-Logik aufzurufen
import { IngredientsService } from './ingredients.service';

//Basis-Route: alles in diesem Controller beginnt mit /ingredients
@Controller('ingredients')
export class IngredientsController {
  //Nest injiziert automatisch den Service
  constructor(private readonly ingredientsService: IngredientsService) {}

  //Route: GET /ingredients/grouped
  @Get('grouped')
  //ruft die Service-Methode auf
  getGrouped() {
    //gibt die DB-Daten direkt als JSON Response zurück
    return this.ingredientsService.getGrouped();
  }
}
