import { Position } from './Position.model';
import { Direction } from './Direction.model';
import { Division } from './Division.model';

export class Filiale extends Position {
    

    constructor(
        public codeFiliale:string,
        public intitulePosition  : string,
        
        public division ? :Division,
        public    type ? :string,
        public  codePosition ?:number
        
      ) { 
        super(codePosition,intitulePosition);
        this.type='filiale';
      }
  }