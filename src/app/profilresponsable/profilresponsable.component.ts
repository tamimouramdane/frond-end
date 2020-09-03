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
  selector: 'app-profilresponsable',
  templateUrl: './profilresponsable.component.html',
  styleUrls: ['./profilresponsable.component.scss']
})
export class ProfilresponsableComponent implements OnInit {

 colls:Array<Employe>=new Array<Employe>();
  employe:Employe;
  user:User;
  fixation:boolean;
  id:number;
  evaluations: Evaluation[]=[];

  employefix:Employe;
  ajoutpossible:boolean;
  add:boolean;
  objectifForm:FormGroup;
  neweva:Evaluation;
 provemp:Employe[]=[];
 selected:Employe;
 subscription: Subscription;
 displayedColumns: string[] = ['Numcoll', 'nom', 'prenom','poste','action'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  dataSource ;
  constructor(private router:Router,private employeService:EmployeService,
     private tokenStorageService: TokenStorageService, private evaluationService:EvaluationService
     , private formBuilder: FormBuilder,private employeService3:EmployeService,
     private evaluationService3:EvaluationService,
     private route : ActivatedRoute) { this.fixation=false;}

  ngOnInit(): void {
    
        this.id= this.tokenStorageService.getUser().id;
     /*
    this.user = new User( this.tokenStorageService.getUser().username,this.tokenStorageService.getUser().password
    ,this.tokenStorageService.getUser().email,null, this.id);
    console.log(this.user);*/
     this.employeService.getEmployeUser(Number( this.id)).subscribe(emp => {
   
    this.employeService.getAllCollabs(emp).subscribe(colls => {
      this.dataSource  = new MatTableDataSource<Employe>(colls);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.colls=colls; 
      
  },
  err => {
    console.log(err); 
  }
  );
});

 
  console.log('2 '+ this.colls.length);
  }
  
  onFixer(employe:Employe){   
   this.selected=employe;
   console.log(this.selected);
    this.fixation=true;
   this.employeService.setcollselec(employe);
   console.log('profilresponsable/coll/:'+employe.user.id);
    this.router.navigate([ 'userpage/:'+this.id+'/profilresponsable/coll/:'+employe.user.id]); 
  }
  
  message:string;

  receiveMessage($event) {
    this.fixation = $event
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
  /*
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
}*/
}


