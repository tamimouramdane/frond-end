import { Poste } from '../models/Poste.model';
import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import {environment} from "src/environments/environment";
 
@Injectable()
export class PosteService {
  private baseUrl =environment.apiUrl+ '/Poste';
  constructor(private http: HttpClient) { }

  getAllPostes() {
    return this.http.get<Poste[]>(this.baseUrl+'/all').pipe(
      map((res: Poste[]) => res));;
  }
   
  createPoste(poste: Poste): Observable<Poste> {
    return this.http.post<Poste>(this.baseUrl+'/add', poste);
  }
  

  updatePoste(poste: Poste) {
    return this.http.put(this.baseUrl + '/update', poste);
}

deletePoste(CodePoste: number) {
    return this.http.delete<Poste>(this.baseUrl + '/delete/'+CodePoste);
}
deleteAll() {
  return this.http.delete(this.baseUrl);
}

}