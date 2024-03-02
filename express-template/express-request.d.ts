declare namespace Express {
  export interface Request {
    decodedToken?: {
      sub: string;
      [key: string]: any;
    };
  }
}
