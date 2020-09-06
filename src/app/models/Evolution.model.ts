import { Employe } from '../models/Employe.model';


export class Evolution {
    constructor(
        public employe:Employe,
        public date: number,
        public type:number,
        public posteSouhaite ? :string,
        public preferenceGeo ? : string,
        public echeance ? : number,
        public commentaireCol ? :string,
        public avisResp ? :string,
        public codeEvolution ?:number,

    ){}
}