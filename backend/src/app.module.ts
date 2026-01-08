import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; //loads .env into process.env
import { TypeOrmModule } from '@nestjs/typeorm'; //Enables TypeORM DB connection
import { RecipesModule } from './recipes/recipes.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    //makes .env variables available everywhere (no need to import again)
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // connect nestjs to sql database using values form .env
    TypeOrmModule.forRoot({
      type: 'postgres', //we use PostgreSQL

      //connection values come from .env
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,

      //auto load entities registred in feature modules
      autoLoadEntities: true,

      //keep false: migrations will control schema changes
      synchronize: false,

      //helpful while learning: prints sql / connection info
      logging: true,
    }),
    //our feature module
    RecipesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
