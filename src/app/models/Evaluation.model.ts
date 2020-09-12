import { Objectif } from './Objectif.model';

export class Evaluation {

constructor(
	public objectif:Objectif,
	public typeEvaluation :boolean,
	public  kpi:string,
	public cible :string,
	public annee:number,
	public  ponderation ? :number,
	public  planAction ?:string,
	public  evalMiParcours ? :number,
	public  evalFinale ? :number,
	public  codeEvaluation ? :number
    ){
}
}