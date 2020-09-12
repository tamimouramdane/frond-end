import { Employe } from '../models/Employe.model';


export class Evolution {
    constructor(
        public employe:Employe,
        public date: number,
        public type:number,
        public posteSouhaite ? :string,
        public preferenceGeo ? : string,
        public echeanceEvolution ? : Date,
        public commentaireCol ? :string,
        public avisResp ? :string,
        public voteResp ? : number,
        public codeEvolution ?:number,

    ){}
}