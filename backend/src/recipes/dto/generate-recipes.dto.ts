//Beschreibt die Eingabe für den Recipe Generator
//Generiere Vorschläge basieren auf einfachen Filtern
export class GenerateRecipesDto {
  category?: string;
  maxDuration?: number;
  //Wieviele Vorschläge sollen zurückgegeben werden
  //Wenn nicht gesetzt, nehmen wir z.B. 5.
  limit?: number;
}
