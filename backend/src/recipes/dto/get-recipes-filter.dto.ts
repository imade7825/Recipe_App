//Describes the allowed query parameters for filtering recipes.
//All fields are optional so the client can combine them freely.

export class GetRecipesFilterDto {
  //Free text serarch in title an description
  search?: string;
  category?: string;
  maxDuration?: number;
}
