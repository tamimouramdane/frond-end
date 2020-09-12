import { Component, OnInit, Input ,ViewChild } from '@angular/core';
import { Evaluation } from '../models/Evaluation.model';
import { Employe } from '../models/Employe.model';
import { EmployeService } from '../services/Employe.service';
import { EvaluationService } from '../services/Evaluation.service';
import { EvaluationIndividuelle } from '../models/EvaluationIndividuelle.model';
import { TokenStorageService } from '../services/token-storage.service';
import { User } from '../models/User.model';
import { MatTableDataSource } from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatFormFieldControl} from '@angular/material/form-field'
import {MatPaginatorModule, MatPaginator} from '@angular/material/paginator';
import { Ponderation } from '../models/Ponderation.model';
import { PhaseService } from '../services/phase.service';

@Component({
  selector: 'app-fixationcol',
  templateUrl: './fixationcol.component.html',
  styleUrls: ['./fixationcol.component.scss']
})
export class FixationcolComponent implements OnInit {
  evaluations:Array<Evaluation>=new Array<Evaluation>();
  id:string;
  employe:Employe;
  ajoutpossible:boolean;
  user:User;
  displayedColumns: string[] = ['Numobjectif', 'intituleObjectif', 'ponderation','plandaction','kpi','cible',
  'echeancierDeRealisation','tauxAtteinte','action1'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  dataSource ;
  displayedColumns1: string[] = ['typeobjectif','intituledivfil','objectif', 'ponderation','plandaction','kpi','cible'];
  dataSource2 ;
   displayedColumns2: string[] = ['typeobjectif','intituledivfil','objectif','ponderation','plandaction','kpi','cible'];
  ponderations:Array<Ponderation>=new Array<Ponderation>();
   dataSource1 ;
  enableEdit=false;
  enableEditIndex;
  errorMessage = '';
  tauxAtteinte;
  changtaux: boolean;
  date: any;
  constructor(
    private employeService:EmployeService, private evaluationService:EvaluationService,
    private tokenStorageService: TokenStorageService,private phaseService:PhaseService) { }
     @Input() test;
    ngOnInit(): void {
      
      this.id= this.tokenStorageService.getUser().id;
   this.employeService.getEmployeUser(Number(this.id)).subscribe(emp => {
        console.log(emp);
        this.evaluationService.getAllPonderations( emp.codeEmploye).subscribe(ponds=>{
  
      
          this.dataSource2  = new MatTableDataSource<Ponderation>(ponds);
          this.ponderations=ponds;  
          
      
         },
         err =>{
          console.log(err.error.message);  
         });

        this.evaluationService.getAllEvaluation(String(emp.codeEmploye)).subscribe(evas => {
          this.dataSource  = new MatTableDataSource<EvaluationIndividuelle>(evas);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
          this.evaluations=evas;        console.log('ajout');
          console.log("marche"+ evas.length);
          });
          
      });
     
      this.employeService.getEmploye().subscribe(emp => {
        console.log('profil coll  ' + emp.user.password);
     
  });

  this.phaseService.getPhase().subscribe(phase => {
    if(phase.date>0){
      this.date=phase.date;
    }
    if(phase.etape ==4 || phase.etape==6){
      this.changtaux=true;
          }
          else{
      this.displayedColumns.pop();
      this.changtaux=false;
          }
   },
   err =>{
      console.log(err.error.message);
   });

  }
    
    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  
    enableEditMethod(e, i,element) {
    this.tauxAtteinte=element.tauxAtteinte;
    console.log('taux 1 '+element.tauxAtteinte);
    this.enableEdit = true;
      this.enableEditIndex = i;
    }
  
    saveSegment(element){
      if(this.tauxAtteinte==null ){
        console.log('taux 2  vide');
      }else {
        element.tauxAtteinte= this.tauxAtteinte;
        console.log('taux 2 '+element.tauxAtteinte);
   this.evaluationService.updateEvaluationInd(element).subscribe(eva => {
        this.ngOnInit(); 
     },
     err => {
       this.errorMessage = err.error.message; 
     });
   this.enableEdit = false;
      this.enableEditIndex = null;
    }
    }
    cancel(i){
      this.enableEdit = false;
      this.enableEditIndex = null;
    }
    delete(e,codeDivision){
      console.log('codeDivision   '+codeDivision);
    }

}
