import { Poste } from './Poste.model';

export abstract class Position {
  
    constructor(
      public  codePosition ?:number,
      public intitulePosition ?: string,
    ) {}
  }