import { Division } from '../models/Division.model';
import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import {environment} from "src/environments/environment";
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable(
)
export class DivisionService {
  private baseUrl = environment.apiUrl+'/Division';
  constructor(private http: HttpClient) { }

  getAllDivisions() {
    return this.http.get<Division[]>(this.baseUrl+'/all').pipe(
      map((res: Division[]) => res));
  }

 

  createDivision(division: Division): Observable<Division> {
    return this.http.post<Division>(this.baseUrl+'/add', division);
  }
  

  updateDivision(/*codePosition: number,*/ division: Division) {
    return this.http.put(this.baseUrl + '/update', division);
}

deleteDivision(CodePosition: number) {
    return this.http.delete<Division>(this.baseUrl +'/delete/'+ CodePosition);
}
deleteAll() {
  return this.http.delete(this.baseUrl);
}

 /*
cpt:number=0;
getDivision(intitulePosition:string,divisions:Division[]):Division{
  for(let division of divisions){
    if(division.intitulePosition===intitulePosition){
      this.cpt=divisions.indexOf(division);
      return divisions[this.cpt]; 
    }
  }
}

 
    static id:number=0;
    divisions: Division[]= [];
  divisionSubject = new Subject<Division[]>();
  
  constructor() { }

  emitDivisions() {
    this.divisionSubject.next(this.divisions.slice());
  }

  addDivision(division: Division) {
    this.divisions.push(division);
    this.emitDivisions();
  }
  
  supDivision(division: Division) {
   this.divisions.splice( this.divisions.indexOf(division),1);
    this.emitDivisions();
  }

  existeDivision(intituledivision:string):boolean{
    for(let division of this.divisions){
      if(division.IntituleDivision===intituledivision){
        return true;
      }
    }
    return false;
  }
  cpt:number=0;
  getDivision(intituledivision:string):Division{
    for(let division of this.divisions){
      if(division.IntituleDivision===intituledivision){
        this.cpt=this.divisions.indexOf(division);
        return this.divisions[this.cpt];
      }
    }
  }

  modifierDivisionObjectif(division:Division,objectif :Objectif){
    this.divisions[this.divisions.indexOf(division)].ObjectifDivision=objectif;
   }


   addFilialeDivision(filiale:Filiale,division:Division){
    this.cpt=this.divisions.indexOf(division);
 
     if(this.divisions[this.cpt].Filiales!=null){
     this.divisions[this.cpt].Filiales.push(filiale);
     }
     else{
       this.divisions[this.cpt].Filiales=[filiale];
     }
   }
   */
}