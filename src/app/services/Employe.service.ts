import { Employe } from '../models/Employe.model';
import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Evaluation } from '../models/Evaluation.model';
import { User } from '../models/User.model';
import {environment} from "src/environments/environment";
 
@Injectable()
export class EmployeService {
   /*
  private subject = new Subject<Employe>();
  private baseUrl = 'http://localhost:8080/emp';
  constructor(private http: HttpClient) { }

  sendEmploye(emp: Employe) {
    this.subject.next(emp);
}
getMessage(): Observable<Employe> {
  return this.subject.asObservable();
}*/
  private emplconnecte:Employe;
  private collselec :Employe;
  private subject = new Subject<Employe>();
  private baseUrl =environment.apiUrl+ '/emp';
  constructor(private http: HttpClient) { }

  getEmployeco(){ return this.emplconnecte}
  setEmployeco(emp:Employe){this.emplconnecte=emp}

  getcollselec(){ return this.collselec}
  setcollselec(emp:Employe){this.collselec=emp}
  
  sendEmploye(emp: Employe) {
    this.subject.next(emp);
}
getEmploye(): Observable<Employe> {
  return this.subject.asObservable();
}


  getAllEmployes(): Observable<Employe[]> {
    return this.http.get<Employe[]>(this.baseUrl+'/all');
  }
/*
  getAllEmployes(): Observable<Employe[]> {
    return this.http.get<Employe[]>(this.baseUrl+'/all').pipe(
      map((res: Employe[]) => res));
  }
   */
  getAllCollabs(employe: Employe): Observable<Employe[]> {
    return this.http.post<Employe[]>(this.baseUrl + '/collabs',employe);
    
  }

 
  
  getEmployeUser(id:number): Observable<Employe> {
    return this.http.get<Employe>(this.baseUrl + '/getEmploye/'+id);
  }
  createEmploye(employe: Employe): Observable<Employe> {
    return this.http.post<Employe>(this.baseUrl+'/add', employe);
  }
  

  updateEmploye(employe: Employe) {
    return this.http.put(this.baseUrl +'/update', employe);
}

deleteEmploye(CodeEmploye: number) {
    return this.http.delete<Employe>(this.baseUrl + '/delete/'+CodeEmploye);
}

deleteAll() {
  return this.http.delete(this.baseUrl);
}

}