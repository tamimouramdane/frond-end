import { Employe } from './Employe.model';
import { Evaluation } from './Evaluation.model';

export class Validation {
    constructor(
        public employe : Employe,
        public typeVal:number,
        public dateCol : Date,
        public dateResp : Date,
        public tro: number,
        public commentaireCol:string,
        public commentaireResp:string,
        public valCol :boolean,
        public valResp :boolean,
        public anneeVal : number,
        public pointFrot ? :string,
        public pointAm ?:string,
        public codeValidation ? : number
 ){}
}

