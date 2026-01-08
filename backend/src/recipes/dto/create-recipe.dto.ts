//DTO Data Transfer Object
//beschreibt die daten, die beim Erstellen eines Rezepts via API erlaubt sind

export class CreateRecipeDto {
  title: string;
  description?: string;
  instructions: string;
  durationMinutes: number;
  imageUrl?: string;
}
