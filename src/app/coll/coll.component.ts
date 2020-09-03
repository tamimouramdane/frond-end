import { Component, OnInit ,ViewChild} from '@angular/core';
import { Employe } from '../models/Employe.model';
import { Router } from '@angular/router';
import { EmployeService } from '../services/Employe.service';
import { TokenStorageService } from '../services/token-storage.service';
import { User } from '../models/User.model';
import { CanActivate, ActivatedRoute } from '@angular/router';
import { Evaluation } from '../models/Evaluation.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EvaluationService } from '../services/Evaluation.service';
import { MatTableDataSource } from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatFormFieldControl} from '@angular/material/form-field'
import {MatPaginatorModule, MatPaginator} from '@angular/material/paginator';


@Component({
  selector: 'app-coll',
  templateUrl: './coll.component.html',
  styleUrls: ['./coll.component.scss']
})
export class CollComponent implements OnInit {
 id;
  constructor(private router:Router, private tokenStorageService: TokenStorageService,
    private employeService:EmployeService,private route : ActivatedRoute) { }

  ngOnInit(): void {
    this.id = String(this.route.snapshot.params['id']).substring(1,String(this.route.snapshot.params['id']).length);
    console.log('tttttt'+this.id);
    this.employeService.getEmployeUser(Number(this.id)).subscribe(emp => {
      this.employeService.setcollselec(emp);
      console.log('tttttt  '+ this.employeService.getcollselec().nom);
     
        } );  
  }

  Retour(){
    this.router.navigate(['userpage/:'+this.tokenStorageService.getUser().id +'/profilresponsable']);
  }

}
