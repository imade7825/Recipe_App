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
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';

import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { GetRecipesFilterDto } from './dto/get-recipes-filter.dto';
import { GenerateRecipesDto } from './dto/generate-recipes.dto';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

//Controller: definiert die Http-Routen für Rezepte
@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  //Test Route
  @UseGuards(JwtAuthGuard)
  @Get('private')
  privateRoute(@Req() req: Request) {
    return {
      message: 'Du bist eingelogt',
      user: req.user ?? null, //Kommt aus JwtStrategy.validate()
    };
  }

  //GET /recipes?search=...&category=...&maxDuration=...
  //Liest alle Query-Parameter ein und übergibt sie an den Service
  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('maxDuration') maxDurationRaw?: string,
  ) {
    //Query-Prameter kommen als Strings an > hier wird explizit umgewandelt
    //maxDuration kann als String kommen > in Zahl umwandeln
    let maxDuration: number | undefined = undefined;
    if (maxDurationRaw !== undefined && maxDurationRaw !== null) {
      const parsed = Number(maxDurationRaw);
      if (!Number.isNaN(parsed)) {
        maxDuration = parsed;
      }
    }

    //Neues Filter Objekt mit korrektem Typen
    const filters: GetRecipesFilterDto = {
      search,
      category,
      maxDuration,
    };
    console.log('Controller filters:', filters);
    return this.recipesService.findAll(filters);
  }

  //Post /recipes/generate
  @Post('generate')
  generate(@Body() body: GenerateRecipesDto) {
    return this.recipesService.generateSuggestions(body);
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
