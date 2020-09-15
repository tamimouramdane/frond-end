import { Component, OnInit, ViewChild } from '@angular/core';
import { CanActivate, ActivatedRoute, Router } from '@angular/router';
import { EmployeService } from '../services/Employe.service';
import { Evaluation } from '../models/Evaluation.model';
import { Employe } from '../models/Employe.model';
import { Objectif } from '../models/Objectif.model';
import { FormGroup, FormBuilder ,Validators} from '@angular/forms';
import { TokenStorageService } from '../services/token-storage.service';
import { from } from 'rxjs';
import { EvaluationService } from '../services/Evaluation.service';
import { ObjectifService } from '../services/Objectif.service';
import { EvaluationIndividuelle } from '../models/EvaluationIndividuelle.model';
import { PhaseService } from '../services/phase.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-evaluationcol',
  templateUrl: './evaluationcol.component.html',
  styleUrls: ['./evaluationcol.component.scss']
})
export class EvaluationcolComponent implements OnInit {
  date;
  evalmi:boolean;
  coll:Employe;
  commentaireCollabFin;
  evalMiParCollab;
  id:number;
a:string;
tro;
evalf;
displayedColumns: string[] ;
@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
@ViewChild(MatSort, {static: true}) sort: MatSort;
dataSource ;
evaluations:Array<EvaluationIndividuelle>=new Array<EvaluationIndividuelle>();
  employe:Employe;
  add:boolean;
  selectedDev;
   evacollectifs:Array<Evaluation>=new Array<Evaluation>();
   objectifs:Array<Objectif>=new Array<Objectif>();
   evalcollmi; commentairecolmi; evalcollfi;  commentairecolfi;
   evaresmi; commi; evaresf; comf;
   selectedDevice;
   evaluationind :EvaluationIndividuelle;
   objselect :EvaluationIndividuelle;
   coleval:boolean;
   evalForm:FormGroup;
   errorMessage = '';
   loading = false;
   submitted = false;
   eval:boolean=false;
  evalmidep: boolean;
  enableEdit: boolean;
  enableEditIndex: any;
  evalMiParcours: any;
  evalFinCollab: any;
  commentaireCollabMiPar: any;
  constructor( private route: ActivatedRoute, private employeService:EmployeService,
     private evaluationService:EvaluationService,private objectifService:ObjectifService
     , private formBuilder: FormBuilder,private tokenStorageService:TokenStorageService
     ,private phaseService:PhaseService) { }

  ngOnInit(): void {
    this.add=false;
    
    this.id= this.tokenStorageService.getUser().id;
   
  this.employeService.getEmployeUser(Number(this.id)).subscribe(emp => {
     
       this.evaluationService.getAllEvaluation(String(emp.codeEmploye)).subscribe(evas => {
        this.dataSource  = new MatTableDataSource<EvaluationIndividuelle>(evas);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
         this.evaluations=evas;   console.log(emp);
         });
         this.evaluationService.getTro(emp.codeEmploye).subscribe(tro=>{
          this.tro=tro;
        },
        err=>{
  
        });
     });

     this.phaseService.getPhase().subscribe(phase => {
      if(phase.date>0){
        this.date=phase.date;
      }
     
      if(phase.etape >=5 && phase.etape <=8){
        this.evalmidep=true;
       
      if(phase.etape== 5){
        this.evalmi=true;
        this.displayedColumns = ['Numobjectif', 'intituleObjectif', 'ponderation','evalMiParCollab','commentaireCollabMiPar','evalMiParcours','commentaireRespMiPar','action1'];
        return;
       }
       this.evalmi=false;  
        
      if(phase.etape ==6){
        this.displayedColumns = ['Numobjectif', 'intituleObjectif', 'ponderation','evalMiParCollab','commentaireCollabMiPar','evalMiParcours','commentaireRespMiPar'];
        return;
       }   
       if(phase.etape==7){
        this.evalf=true;
        this.displayedColumns = ['Numobjectif', 'intituleObjectif', 'ponderation','evalFinCollab','commentaireCollabFin','evalFinale','commentaireRespFin','action1'];
        return;
       } 
       this.evalf=false;
       if(phase.etape==8){
       
        this.displayedColumns = ['Numobjectif', 'intituleObjectif', 'ponderation','evalFinCollab','commentaireCollabFin','evalFinale','commentaireRespFin'];   
        return;
       } 
       
      
          }
          
     },
     err =>{
        console.log(err.error.message);
     });
    
   
  }

  initForm() {
    this.evalForm = this.formBuilder.group({
      evalcollmi: [''],
      commentairecolmi: [''],
      evalcollfi:[''],
      commentairecolfi:[''],  
    });
  }



  
  enableEditMethod(e, i,element) { 
    this.evalMiParCollab = element.evalMiParCollab;
    this.evalFinCollab = element.evalFinCollab;
    this.commentaireCollabMiPar=element.commentaireCollabMiPar;
    this.commentaireCollabFin= element.commentaireCollabFin;
   
      this.enableEdit = true;
      this.enableEditIndex = i;
      console.log(i, e);
    
  }
    saveSegment(element){

        element.evalMiParCollab = this.evalMiParCollab;
        element.evalFinCollab = this.evalFinCollab;
        element.commentaireCollabMiPar=  this.commentaireCollabMiPar;
        element.commentaireCollabFin=  this.commentaireCollabFin;
      this.evaluationService.updateEvaluationInd(element).subscribe(eva => {
        this.ngOnInit(); 
     },
     err => {
       this.errorMessage = err.error.message;
     });
    
    
      this.enableEdit = false;
      this.enableEditIndex = null;
    
    }

    cancel(i){
  
      this.enableEdit = false;
      this.enableEditIndex = null;
    }
    
}
