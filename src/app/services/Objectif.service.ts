import { Objectif } from '../models/Objectif.model';
import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import {environment} from "src/environments/environment";
 
@Injectable()
export class ObjectifService {
  private baseUrl =environment.apiUrl+ '/Objectif';
  constructor(private http: HttpClient) { }

  getAllObjectifs() {
    return this.http.get<Objectif[]>(this.baseUrl+'/all').pipe(
      map((res: Objectif[]) => res));;
  }
   
  createObjectif(objectif: Objectif): Observable<Objectif> {
    return this.http.post<Objectif>(this.baseUrl+'/add', objectif);
  }
  

  updateObjectif( objectif: Objectif) {
    return this.http.put(this.baseUrl +'/update', objectif);
}

deleteObjectif(CodeObjectif: string): Observable<Objectif> {
    return this.http.delete<Objectif>(this.baseUrl + '/delete');
}

deleteAll() {
  return this.http.delete(this.baseUrl);
}

}