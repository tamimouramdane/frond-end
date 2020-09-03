import { Position } from './Position.model';
import { Filiale } from './Filiale.model';
import {Service} from './Service.model'
export class Direction extends Position {
    
    
    constructor(
        public codeDirection:string,
        public intitulePosition:string,
        public filiale ? :Filiale,
        public type:string='direction',
        public codePosition ?:number,
     

       
      ) {
        super(codePosition,intitulePosition);
      }
  }