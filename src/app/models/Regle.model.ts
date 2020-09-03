import { EvaluationIndividuelle } from './EvaluationIndividuelle.model';


export class Regle {
    constructor(
        public codeRegle:number,
        public nomRegle:string,
        public conditionRegle:number,
        public actionRegle:number,
        public evaluations:EvaluationIndividuelle[]

    ){}
}