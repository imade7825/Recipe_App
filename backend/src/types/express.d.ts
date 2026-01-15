//Wir erweitern den Express Request-Typ, damit Typescript weiß, dass req.user existiert
//Wichtig: Das ist nur Typing (kein Runtime-Code)

export {};

declare global {
  namespace Express {
    interface User {
      //Das sind die Felder, die in JwtStrategy.validate() zurückgibst
      userId: number;
      email: string;
    }

    interface Request {
      //Passport hängt user an den Request
      user?: User;
    }
  }
}
