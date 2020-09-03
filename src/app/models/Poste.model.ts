import { Filiale } from './Filiale.model';
import { Observable } from 'rxjs';
import {Service} from './Service.model';
import {Direction} from './Direction.model';
import {Division} from './Division.model';
export class Poste {
    constructor(
      
      public intitulePoste: string,
      public categoriePoste :string,
      public position  : Division | Filiale |Direction |Service,
      public  codePoste?:number,
     
    ) {}
  }