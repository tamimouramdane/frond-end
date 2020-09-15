import { Evaluation } from '../models/Evaluation.model';
import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Employe } from '../models/Employe.model';
import { EvaluationIndividuelle } from '../models/EvaluationIndividuelle.model';
import { Filiale } from '../models/Filiale.model';

import {Service} from '../models/Service.model';
import {Direction} from '../models/Direction.model';
import {Division} from '../models/Division.model';
import { Ponderation } from '../models/Ponderation.model';
import {environment} from "src/environments/environment";

@Injectable()
export class EvaluationService {
  private baseUrl =environment.apiUrl+ '/Evaluation';
  constructor(private http: HttpClient) { }

  getEvalsCollect(codeposition:number):Observable<Evaluation[]>{
    return this.http.get<Evaluation[]>(this.baseUrl+'/evaCollect/'+codeposition);
  }

  getAllEvaluation(id: string):Observable<EvaluationIndividuelle[]> {
    return this.http.get<EvaluationIndividuelle[]> (this.baseUrl+'/allEmp/'+id);
   }
   
  getAllEvaluations(): Observable<Evaluation[]> {
    return this.http.get<Evaluation[]>(this.baseUrl+'/all');
  }

  getAllPonderations(codeemploye: number): Observable<Ponderation[]> {
    return this.http.get<Ponderation[]>(this.baseUrl+'/allPonderation/'+codeemploye);
  }

  getTro(codeemploye: number): Observable<number> {
    return this.http.get<number>(this.baseUrl+'/getTRG/'+codeemploye);
  }

  createPonderation(ponderation: Ponderation): Observable<Ponderation> {
    return this.http.post<Ponderation>(this.baseUrl+'/addPonderation', ponderation);
  }
  updatePonderation(ponderation: Ponderation) {
    return this.http.put(this.baseUrl +'/updatePonderation', ponderation);
}

  createEvaluation(evaluation: Evaluation): Observable<Evaluation> {
    return this.http.post<Evaluation>(this.baseUrl+'/add', evaluation);
  }
   
  createEvaluationInd(evaluation: EvaluationIndividuelle): Observable<EvaluationIndividuelle> {
    return this.http.post<EvaluationIndividuelle>(this.baseUrl+'/addEI', evaluation);
  }

  updateEvaluation(evaluation: Evaluation) {
    return this.http.put(this.baseUrl +'/update', evaluation);
}

updateEvaluationInd(evaluationind:EvaluationIndividuelle){
  return this.http.put(this.baseUrl +'/updateEI', evaluationind);
}

deleteEvaluation(CodeEvaluation: number) {
    return this.http.delete<Evaluation>(this.baseUrl + '/delete/'+CodeEvaluation);
}
deleteEvaluationInd(CodeEvaluation: number) {
  return this.http.delete<EvaluationIndividuelle>(this.baseUrl + '/deleteEI/'+CodeEvaluation);
}

getSommePond(codeemploye:number) : Observable<number>{
return this.http.get<number>(this.baseUrl + '/getSommePonderations/'+ codeemploye);
}

deleteAll() {
  return this.http.delete(this.baseUrl);
}

}