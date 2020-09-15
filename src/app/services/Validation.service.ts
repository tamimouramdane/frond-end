import { Poste } from '../models/Poste.model';
import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import {environment} from "src/environments/environment";
import { Validation } from '../models/Validation.model';
 
@Injectable()
export class ValidationService {
  private baseUrl =environment.apiUrl+ '/Validation';
  constructor(private http: HttpClient) { }

  getValidation(codeemploye: number): Observable<Validation> {
    return this.http.get<Validation>(this.baseUrl+'/getByPhase/'+codeemploye);
  }
   
  createValidation(validation: Validation): Observable<Validation> {
    return this.http.post<Validation>(this.baseUrl+'/add', validation);
  }
  

  updateValidation(validation: Validation) {
    return this.http.put(this.baseUrl + '/update', validation);
}


  


}