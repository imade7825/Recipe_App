//Verbindet Http-Routen mit dem Service
import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

//Controller: definiert die Http-Routen für Rezepte
@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  //GET /recipes
  //Alle rezepte zurückgeben
  @Get()
  findAll() {
    return this.recipesService.findAll();
  }

  //GET /recipes/:id
  //Ein Rezept per ID zurückgeben
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.recipesService.findOne(id);
  }

  //POST / recipes
  //Neues Rezept erstellen
  @Post()
  create(@Body() body: CreateRecipeDto) {
    return this.recipesService.create(body);
  }

  // PATCH /recipes/:id
  //Rezept teilweise aktualisieren
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateRecipeDto) {
    return this.recipesService.update(id, body);
  }

  //DELETE /recipes/:id
  //Rezept löschen
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.recipesService.remove(id);
  }
}
