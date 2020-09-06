import { Service } from '../models/Service.model';
import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import {environment} from "src/environments/environment";
 
@Injectable()
export class ServiceService {
  private baseUrl =environment.apiUrl+ '/Service';
  constructor(private http: HttpClient) { }

  getAllServices() {
    return this.http.get<Service[]>(this.baseUrl+'/all').pipe(
      map((res: Service[]) => res));;
  }
   
  createService(service: Service): Observable<Service> {
    return this.http.post<Service>(this.baseUrl+'/add', service);
  }
  

  updateService( service: Service) {
    return this.http.put(this.baseUrl +'/update', service);
}

deleteService(codePosition: number) {
    return this.http.delete<Service>(this.baseUrl + '/delete/'+codePosition);
}

deleteAll() {
  return this.http.delete(this.baseUrl);
}

}