import { Direction } from '../models/Direction.model';
import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import {environment} from "src/environments/environment";
 
@Injectable()
export class DirectionService {
  private baseUrl = environment.apiUrl+ '/Direction';
  constructor(private http: HttpClient) { }

  getAllDirections() {
    return this.http.get<Direction[]>(this.baseUrl+'/all').pipe(
      map((res: Direction[]) => res));;
  }
   
  createDirection(direction: Direction): Observable<Direction> {
    return this.http.post<Direction>(this.baseUrl+'/add', direction);
  }
  

  updateDirection( direction: Direction) {
    return this.http.put(this.baseUrl +'/update', direction);
}

deleteDirection(CodePosition: number){
    return this.http.delete<Direction>(this.baseUrl+'/delete/'+CodePosition );
}

deleteAll() {
  return this.http.delete(this.baseUrl);
}

}