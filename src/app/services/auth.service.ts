import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/User.model';
import { Employe } from '../models/Employe.model';
import {environment} from "src/environments/environment";
const AUTH_API = environment.apiUrl+'/api/auth/' ;
//'http://localhost:8080/api/auth/'
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(user:User): Observable<User> {
    return this.http.post<User>(AUTH_API + 'signin',user, httpOptions);
  }

  register(user:User): Observable<any> {
    return this.http.post(AUTH_API + 'signup', user, httpOptions);
  }
}