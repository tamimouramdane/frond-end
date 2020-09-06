import { Phase } from '../models/Phase.model';
import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import {environment} from "src/environments/environment";
 
@Injectable()
export class PhaseService {
  private baseUrl =environment.apiUrl+ '/Phase';
  private obcol:boolean;
  constructor(private http: HttpClient) { }

  getPhase(): Observable<Phase> {
    return this.http.get<Phase>(this.baseUrl+'/getPhase');
  }

  setPhase( phase: Phase) {
    return this.http.put(this.baseUrl +'/update', phase);
}


}