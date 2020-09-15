import { Component, OnInit, ViewChild } from '@angular/core';
import { CanActivate, ActivatedRoute, Router } from '@angular/router';
import { EmployeService } from '../services/Employe.service';
import { Evaluation } from '../models/Evaluation.model';
import { Employe } from '../models/Employe.model';
import { Objectif } from '../models/Objectif.model';
import { FormGroup, FormBuilder ,Validators} from '@angular/forms';

import { from } from 'rxjs';
import { EvaluationService } from '../services/Evaluation.service';
import { ObjectifService } from '../services/Objectif.service';
import { EvaluationIndividuelle } from '../models/EvaluationIndividuelle.model';
import { PhaseService } from '../services/phase.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.scss']
})
export class EvaluationComponent implements OnInit {
  coll:Employe;
  id:number;
a:string;
tro;
fort; amel;
evalmi:boolean;
evaluations:Array<EvaluationIndividuelle>=new Array<EvaluationIndividuelle>();
  employe:Employe;
  commentaireRespMiPar;  commentaireRespFin;
  evalf;
  add:boolean;
  selectedDev;
   evacollectifs:Array<Evaluation>=new Array<Evaluation>();
   objectifs:Array<Objectif>=new Array<Objectif>();
   evaresmi; commi; evaresf;  comf;
   evalcollmi;  evalcollfi; commentairecolmi;  commentairecolfi;
   selectedDevice;
   evaluationind :EvaluationIndividuelle;
   objselect :EvaluationIndividuelle;
   displayedColumns: string[] ;
   @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
   @ViewChild(MatSort, {static: true}) sort: MatSort;
   dataSource ;
   coleval:boolean;
   evalForm:FormGroup;
   errorMessage = '';
   loading = false;
   submitted = false;
   eval:boolean=false;
  date: number;
  evalmidep: boolean;
  enableEdit: boolean;
  enableEditIndex: any;
  evalMiParCollab: any;
  evalMiParcours: any;
  evalFinCollab: any;
  evalFinale: any;
  etape: number;
  constructor( private route: ActivatedRoute, private employeService:EmployeService,
     private evaluationService:EvaluationService,private objectifService:ObjectifService
     , private formBuilder: FormBuilder,private phaseService:PhaseService) { }

  ngOnInit(): void {
    this.add=false;
    this.coll=this.employeService.getcollselec();
    this.a =String( this.route.parent.snapshot.params['id'] ).substring(1,String( this.route.parent.snapshot.params['id'] ).length) ; 
    console.log('a   '+this.a); 
   
  this.employeService.getEmployeUser(Number(this.a)).subscribe(emp => {
    this.coll=emp;  
    this.evaluationService.getAllEvaluation(String(this.coll.codeEmploye)).subscribe(evas => {
      this.dataSource  = new MatTableDataSource<EvaluationIndividuelle>(evas);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.evaluations=evas;
      });
      this.evaluationService.getTro(emp.codeEmploye).subscribe(tro=>{
        this.tro=tro;
      },
      err=>{

      });
  }  );
  this.phaseService.getPhase().subscribe(phase => {  this.etape=phase.etape;
    if(phase.date>0){
      this.date=phase.date;
    }
    if(phase.etape >=5 && phase.etape <=8){
      this.evalmidep=true;
     
    if(phase.etape== 5){
      this.evalmi=true;
      this.displayedColumns = ['Numobjectif', 'intituleObjectif', 'ponderation','evalMiParCollab','comColMi','evalMiParcours','commentaireRespMiPar','action1'];
      return;
     }
     this.evalmi=false;  
      
    if(phase.etape ==6){
      this.displayedColumns = ['Numobjectif', 'intituleObjectif', 'ponderation','evalMiParCollab','comColMi','evalMiParcours','commentaireRespMiPar'];
      return;
     }   
     if(phase.etape==7){
      this.evalf=true;
      this.displayedColumns = ['Numobjectif', 'intituleObjectif', 'ponderation','evalFinCollab','commentaireCollabFin','evalFinale','comFi','action1'];
      return;
     } 
     this.evalf=false;
     if(phase.etape==8){
     
      this.displayedColumns = ['Numobjectif', 'intituleObjectif', 'ponderation','evalFinCollab','commentaireCollabFin','evalFinale','comFi'];   
      return;
     } 
     
    
        }
   },
   err =>{
      console.log(err.error.message);
   });

    this.initForm();
  }

  initForm() {
    this.evalForm = this.formBuilder.group({
      evalreslmi: ['' ],
      commentaireresmi: [''],
      evalreslfi:[''],
      commentaireresfi:[''],  
    });
  }



  enableEditMethod(e, i,element) { 
    this.evalMiParCollab = element.evalMiParCollab;
    this.evalMiParcours = element.evalMiParcours;
    this.evalFinCollab = element.evalFinCollab;
    this.evalFinale = element.evalFinale;
    this.commentaireRespMiPar=element.commentaireRespMiPar;
    this.commentaireRespFin= element.commentaireRespFin;
   
   
      this.enableEdit = true;
      this.enableEditIndex = i;
      console.log(i, e);
    
  }
    saveSegment(element){

        element.evalMiParCollab = this.evalMiParCollab;
        element.evalMiParcours = this.evalMiParcours;
        element.evalFinCollab = this.evalFinCollab;
        element.evalFinale = this.evalFinale;
        element.commentaireRespMiPar=  this.commentaireRespMiPar;
        element.commentaireRespFin=  this.commentaireRespFin;
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
