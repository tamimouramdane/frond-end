import { Filiale } from '../models/Filiale.model';
import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import {environment} from "src/environments/environment";
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class FilialeService {
  private baseUrl =environment.apiUrl+ '/Filiale';
  constructor(private http: HttpClient) { }

  getAllFiliales() {
    return this.http.get<Filiale[]>(this.baseUrl+'/all').pipe(
      map((res: Filiale[]) => res));;
  }
   
  createFiliale(filiale: Filiale): Observable<Filiale> {
    return this.http.post<Filiale>(this.baseUrl+'/add', filiale,httpOptions);
  }
  

  updateFiliale ( filiale: Filiale) {
    return this.http.put(this.baseUrl + '/update', filiale);
}

deleteFiliale(CodeFiliale: string): Observable<Filiale> {
    return this.http.delete<Filiale>(this.baseUrl + '/delete/'+CodeFiliale);
}

deleteAll() {
  return this.http.delete(this.baseUrl);
}

}