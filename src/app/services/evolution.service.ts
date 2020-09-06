import { Evolution } from '../models/Evolution.model';
import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import {environment} from "src/environments/environment";
 
@Injectable()
export class EvolutionService {
    private baseUrl = environment.apiUrl+'/Evolution' ;
  //  private baseUrl = 'http://localhost:8080/Evolution';
    constructor(private http: HttpClient) { }
  
    getEvolution(c: number): Observable<Evolution>{
      return this.http.get<Evolution>(this.baseUrl+'/all/'+c);
    }
     
    createEvolution(evolution: Evolution): Observable<Evolution> {
      return this.http.post<Evolution>(this.baseUrl+'/add', evolution);
    }
    
  
    updateEvolution( evolution: Evolution) {
      return this.http.put(this.baseUrl +'/update', evolution);
  }
  
  deleteEvolution(CodeEvolution: string): Observable<Evolution> {
      return this.http.delete<Evolution>(this.baseUrl + '/delete/'+CodeEvolution);
  }
  
  }