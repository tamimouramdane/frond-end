import { Employe } from './Employe.model';
import { Evaluation } from './Evaluation.model';

export class Validation {
    constructor(
        public employe : Employe,
        public dateCol : Date,
        public dateResp : Date,
        public typeVal:number,
        public valRespMi :boolean,
        public valRespFin : boolean,
        public valColMi :boolean,
        public valColFin : boolean,
        public tro: number,
        public anneeVal : number,
        public pointFrot ? :string,
        public pointAm ?:string,
        public codeValidation ? : number
 ){}
}