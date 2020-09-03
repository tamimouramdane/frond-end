import { Filiale } from './Filiale.model';
import {Service} from './Service.model';
import {Direction} from './Direction.model';
import {Division} from './Division.model';

export class Objectif {
    constructor(
      
      public nomObjectif: string,
      public typeObjectif:boolean,
      public position ?: Division | Filiale |Direction |Service ,
      public  codeObjectif ? :number
    ) {}
  }