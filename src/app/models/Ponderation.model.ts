import { Employe } from './Employe.model';
import { Evaluation } from './Evaluation.model';

export class Ponderation {
    constructor(
        public employe : Employe,
        public evaluation : Evaluation,
        public  ponderation:number,
        public  planAction :string,
        public id ? : number
 ){}
}