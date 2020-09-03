import { Position } from './Position.model';
import { Filiale } from './Filiale.model';
import { Objectif } from './Objectif.model';


export class Division extends Position {
    
    
    constructor(
        public codeDivision:string,
        public intitulePosition:string,
        public type:string ,
        public codePosition ?:number,
  
        public ObjectifDivision ? :Objectif
      ) {
        super(codePosition ,intitulePosition);
       
      }
    getparam():string{
    return this.codeDivision+','+this.intitulePosition ;
    }
  }