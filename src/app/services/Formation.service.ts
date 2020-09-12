import { Formation } from '../models/Formation.model';
import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import {environment} from "src/environments/environment";
import { Form } from '@angular/forms';
 
@Injectable()
export class FormationService {
  private baseUrl = environment.apiUrl+'/Formation' ;
//  private baseUrl = 'http://localhost:8080/Formation';
  constructor(private http: HttpClient) { }

  getAllFormations(c: number): Observable<Formation[]>{
    return this.http.get<Formation[]>(this.baseUrl+'/all/'+c);
  }
  
  getFormationPas(c:number):Observable<Formation[]>{
    return this.http.get<Formation[]>(this.baseUrl+'/lastYear/'+c);
  }
  
  createFormation(formation: Formation): Observable<Formation> {
    return this.http.post<Formation>(this.baseUrl+'/add', formation);
  }
  

  updateFormation( formation: Formation) {
    return this.http.put(this.baseUrl +'/update', formation);
}

deleteFormation(CodeFormation: string): Observable<Formation> {
    return this.http.delete<Formation>(this.baseUrl + '/delete/'+CodeFormation);
}



}