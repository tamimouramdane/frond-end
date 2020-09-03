import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.scss']
})
export class EvaluationComponent implements OnInit {
  coll:Employe;
  id:number;
a:string;
evalmi:boolean;
evaluations:Array<EvaluationIndividuelle>=new Array<EvaluationIndividuelle>();
  employe:Employe;
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
   coleval:boolean;
   evalForm:FormGroup;
   errorMessage = '';
   loading = false;
   submitted = false;
   eval:boolean=false;
  date: number;
  evalmidep: boolean;
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
      this.evaluations=evas;
      });
  }  );
  this.phaseService.getPhase().subscribe(phase => {
    if(phase.date>0){
      this.date=phase.date;
    }
    if(phase.etape >=5 && phase.etape <=10){
      this.evalmidep=true;
    if(phase.etape== 5){
      this.evalmi=true;
     }
          else{
        
            this.evalmi=false;
          }
     if(phase.etape==7){
      this.evalf=true;
     } else{
         this.evalf=false;
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
      evalreslmi: ['',Validators.required ],
      commentaireresmi: [''],
      evalreslfi:[''],
      commentaireresfi:[''],  
    });
  }

  get f() { return this.evalForm.controls; }
  onSubmitForm(){
    this.submitted = true;
    if (this.evalForm.invalid) {
        return;
    }
   const formValue = this.evalForm.value;
   this.objselect.evalMiParcours=formValue['evalreslmi'];
  this.objselect.commentaireRespMiPar=formValue['commentaireresmi'];
   this.objselect.evalFinale=formValue['evalreslfi'];
   this.objselect.commentaireRespFin= formValue['commentaireresfi'];
   this.evaluationService.updateEvaluationInd(this.objselect).subscribe(eva => {
    
 },
 err => {
   this.errorMessage = err.error.message;
   console.log(this.errorMessage);
 });
 this.submitted = false;
 this.eval=false;
  }

  onChangeDev(e){
    this.selectedDevice=e;
  if(e!= ""){
    this.add=true;
    console.log("ov  " + e);
   this.objselect=this.evaluations.find(eva=> eva.objectif.nomObjectif== e);

  this.evalcollmi=this.objselect.evalMiParCollab;
   this.evalcollfi=this.objselect.evalFinCollab;
   this.commentairecolmi=this.objselect.commentaireCollabMiPar;
   this.commentairecolfi=this.objselect.commentaireCollabFin;
   if(!this.objselect.evalMiParCollab){
     this.coleval=false;
   }
   else{
    this.evaresmi=this.objselect.evalMiParcours;
    this.evaresf=this.objselect.evalFinale;
    this.commi=this.objselect.commentaireRespMiPar;
    this.comf=this.objselect.commentaireRespFin;
  }
  }
  else{
    this.add=false;
  }
  }
 
  Annuler(){
    this.eval=false;
  }

  Evaluer(){
  this.eval=true;
  }

}
