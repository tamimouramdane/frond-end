import { Evaluation } from './Evaluation.model';
import { Employe } from './Employe.model';
import { Regle } from './Regle.model';
import { Objectif } from './Objectif.model';

export class EvaluationIndividuelle extends Evaluation{
    constructor(
        public objectif:Objectif,
	public typeEvaluation :boolean,
	public  kpi:string,
    public cible :string,
    public Annee:number,
    public  ponderation:number,
	public  planAction:string,
    public echeancier ?: Date,
    public employe ?:Employe,
    public tauxAtteinte ?: number,
    public  evalMiParcours ? :number,
	public  evalFinale ? :number,
    public  codeEvaluation ? :number,
    
    public  commentaireCollabMiPar ? :number,
	public  commentaireRespMiPar ? :number,
	public  commentaireCollabFin ? :number,
	public  commentaireRespFin ? :number,
        public  evalMiParCollab ? :number,
        public evalFinCollab ?: number,
   
        public regles ?: Regle[]
    ){
        super(	 objectif,
             typeEvaluation ,
              kpi ,
             cible,
             Annee,
             ponderation,
             planAction,
            evalMiParcours,
            evalFinale 
          , codeEvaluation );

    }
}
