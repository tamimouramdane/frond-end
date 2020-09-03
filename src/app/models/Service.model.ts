import { Position } from './Position.model';
import { Direction } from './Direction.model';


export class Service extends Position {
    
    
    constructor(
        public codeService :string,
        public intitulePosition:string,
        public direction  :Direction,
        public type:string='service',
        public  codePosition ? :number,
       
        
      ) {
        super(codePosition,intitulePosition);
      }
  }