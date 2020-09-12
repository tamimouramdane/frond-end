import { Employe } from './Employe.model';


export class Formation {
    constructor(
        public  nomFormation:string,
        public  objectifPrevu :string,
        public dateFormation :number,
        public employe: Employe,
        public demande ? : boolean,
        public  evalColl ? :number,
        public  evalResp?:number,
        public justification ? : string,
        public  codeFormation ?:number
    
    ){}
}