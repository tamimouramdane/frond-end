import { User } from './User.model';
import { Poste } from './Poste.model';
export class Employe {
    constructor(
     
      public nom?: string,
      public prenom ?: string,
      public poste ?:Poste,
      public superieur ?:Employe,
      public user ? :User,
      public  codeEmploye?:number
    ) {}
  }