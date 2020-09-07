import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { EmployeService } from '../services/Employe.service';
import { EvaluationService } from '../services/Evaluation.service';
import { TokenStorageService } from '../services/token-storage.service';
import { ObjectifService } from '../services/Objectif.service';
import { MatDialog } from '@angular/material/dialog';
import { PhaseService } from '../services/phase.service';
import { Ponderation } from '../models/Ponderation.model';
import { Employe } from '../models/Employe.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EvaluationIndividuelle } from '../models/EvaluationIndividuelle.model';
import { Evaluation } from '../models/Evaluation.model';

@Component({
  selector: 'app-validation',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.scss']
})
export class ValidationComponent implements OnInit {
  a: string;
  ponderations:Array<Ponderation>=new Array<Ponderation>();
  evaluations:Array<Evaluation>=new Array<Evaluation>();
  collab:Employe;
  displayedColumns: string[] ;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  dataSource ; dataSource2 ;
  displayedColumns2: string[] ;
  errorMessage: any;
  loading: boolean;
  date: number;
  valmidep: boolean;
  valmi: boolean;
  valfi:boolean;
  id: any;
  coll; resp;
  responsable: Employe;
  selectedDevice: any;
  visa;  eval:boolean;
  datevalid; commencol;
  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder ,
    private employeService:EmployeService, private evaluationService:EvaluationService,
    private tokenStorageService:TokenStorageService,
    private router:Router,private objectifService:ObjectifService ,private dialog: MatDialog
    ,private phaseService:PhaseService) { 
  }

  ngOnInit(): void {
    this.datevalid=new Date().getDate();  new Date()
    this.id= this.tokenStorageService.getUser().id;
    this.employeService.getEmployeUser(Number(this.id)).subscribe(emp => {
    this.resp=emp.nom.toUpperCase() +' '+emp.prenom;
    },
    err =>{
      console.log(err.error.message);  
     });

    this.a =String( this.route.parent.snapshot.params['id'] ).substring(1,String( this.route.parent.snapshot.params['id'] ).length) ; 
    this.employeService.getEmployeUser(Number(this.a)).subscribe(emp => {
    this.coll=emp.nom.toUpperCase() +' '+emp.prenom;  this.collab=emp;
    this.evaluationService.getAllPonderations( this.collab.codeEmploye).subscribe(ponds=>{
      this.dataSource2  = new MatTableDataSource<Ponderation>(ponds);
     this.ponderations=ponds;  
    },
    err =>{
     console.log(err.error.message);  
    });
 
    this.evaluationService.getAllEvaluation(String(this.collab.codeEmploye)).subscribe(evas => {
     this.dataSource  = new MatTableDataSource<EvaluationIndividuelle>(evas);
     this.dataSource.paginator = this.paginator;
     this.dataSource.sort = this.sort;
       this.evaluations=evas;   
     });
 },
 err => { 
   this.errorMessage = err.error.message;
  this.loading = false;
  console.log( this.errorMessage);
 }) ;
 
 this.phaseService.getPhase().subscribe(phase => {
  if(phase.date>0){
    this.date=phase.date;
  }
  if(phase.etape >=6 && phase.etape <=10){
   
    this.valmidep=true;
    if(phase.etape<= 7){
      this.displayedColumns2  = ['typeobjectif','intituledivfil','objectif','ponderation'];
      this.displayedColumns = ['Numobjectif', 'intituleObjectif', 'ponderation','evalMiParCollab','evalMiParcours'];
    
    }else{
      this.displayedColumns2  = ['typeobjectif','intituledivfil','objectif','ponderation','evalFinale'];
      this.displayedColumns = ['Numobjectif', 'intituleObjectif', 'ponderation','evalFinCollab','evalFinale'];
    }
  if(phase.etape== 6){
    this.valmi=true;
   }
        else{
      
          this.valmi=false;
        }
   if(phase.etape>=8){
   if(phase.etape==8){
    this.valfi=true;
   } else{
       this.valfi=false;
   }    
  }
      }
 },
 err =>{
    console.log(err.error.message);
 });
  }

  onChange(e){
    this.selectedDevice=e;
  }
  
  Annuler(){
    this.eval=false;
  }

  Valider(){
    this.eval=true; console.log(this.eval);
  }
  
}
