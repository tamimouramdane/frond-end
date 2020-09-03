import { Employe } from './Employe.model';
import { Role } from './Role.model';


export class User {   
    constructor(
      
      public username  :string,
      public password:string,
      public email ? : string,
      public roles ? :Role[],
      public id ? : number,
      
    ) {}
    
  }
  