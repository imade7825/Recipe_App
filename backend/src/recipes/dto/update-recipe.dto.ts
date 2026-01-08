//DTO für update eines rezeptes
//Alle Felder optional, weil man nur einzelne Felder ändern will

export class UpdateRecipeDto {
  title?: string;
  description?: string;
  instruction?: string;
  durationMinutes?: number;
  imageUrl?: string;
}
