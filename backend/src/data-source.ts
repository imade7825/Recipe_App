import 'dotenv/config'; //Loads backend/.env so the CLI can read DB settings
import { DataSource } from 'typeorm';
//import all entities so typeorm knows the schema to generate migrations from
import { Recipe } from './recipes/entities/recipe.entity';
import { Ingredient } from './recipes/entities/ingredient.entity';
import { Category } from './recipes/entities/category.entity';
import { RecipeIngredient } from './recipes/entities/recipe-ingredient.entity';
import { User } from './auth/entities/user.entity';

//this datasource is used by the typeorm cli(migration generate/run)
//it is not the same as the runtime nestjs typeormmodule.forroot config,
//but it should contain the same connection settings.
export const AppDataSource = new DataSource({
  type: 'postgres',
  //db connection values from .env
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  //entities define the database shema(tables + relations)
  entities: [Recipe, Ingredient, Category, RecipeIngredient, User],

  //migration files will be stored here
  migrations: ['src/migrations/*.ts'],

  //keep false: migrations control schema changes
  synchronize: false,
});
