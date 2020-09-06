import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-evaluationcol',
  templateUrl: './evaluationcol.component.html',
  styleUrls: ['./evaluationcol.component.scss']
})
export class EvaluationcolComponent implements OnInit {
  date;
  evalmi:boolean;
  coll:Employe;
  id:number;
a:string;
evalf;
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
  constructor( private route: ActivatedRoute, private employeService:EmployeService,
     private evaluationService:EvaluationService,private objectifService:ObjectifService
     , private formBuilder: FormBuilder,private tokenStorageService:TokenStorageService
     ,private phaseService:PhaseService) { }

  ngOnInit(): void {
    this.add=false;
    
    this.id= this.tokenStorageService.getUser().id;
    /*
    this.user = new User( this.tokenStorageService.getUser().username,this.tokenStorageService.getUser().password
    ,this.tokenStorageService.getUser().email,null, +this.id);*/
  this.employeService.getEmployeUser(Number(this.id)).subscribe(emp => {
       console.log(emp);
       this.evaluationService.getAllEvaluation(String(emp.codeEmploye)).subscribe(evas => {
         this.evaluations=evas;
         });
     });

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
    
   
  }

  initForm() {
    this.evalForm = this.formBuilder.group({
      evalcollmi: ['',Validators.required ],
      commentairecolmi: [''],
      evalcollfi:[''],
      commentairecolfi:[''],  
    });
  }

  get f() { return this.evalForm.controls; }
  onSubmitForm(){
    this.submitted = true;
    if (this.evalForm.invalid) {
        return;
    }
   const formValue = this.evalForm.value;
   this.objselect.evalMiParCollab=formValue['evalcollmi'];
   this.objselect.commentaireCollabMiPar=formValue['commentairecolmi'];
   this.objselect.evalFinCollab=formValue['evalcollfi'];
   this.objselect.commentaireCollabFin=formValue['commentairecolfi'];
   this.evaluationService.updateEvaluationInd(this.objselect).subscribe(eva => {
   this.ngOnInit(); 
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
    
    console.log( this.selectedDevice);
  if(e!= ""){
    this.initForm();
    this.add=true;
   this.objselect=this.evaluations.find(eva=> eva.objectif.nomObjectif== e);
  
  
     this.evalcollmi=this.objselect.evalMiParCollab;
    this.evalcollfi=this.objselect.evalFinCollab;
    this.commentairecolmi=this.objselect.commentaireCollabMiPar;
    this.commentairecolfi=this.objselect.commentaireCollabFin;
   
  this.evaresmi=this.objselect.evalMiParcours;
  this.evaresf=this.objselect.evalFinale;
  this.commi=this.objselect.commentaireRespMiPar;
  this.comf=this.objselect.commentaireRespFin;
  
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
