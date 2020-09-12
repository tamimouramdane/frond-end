import { Component, OnInit } from '@angular/core';
import { PhaseService } from '../services/phase.service';
import { EmployeService } from '../services/Employe.service';
import { EvaluationService } from '../services/Evaluation.service';
import { FormBuilder } from '@angular/forms';
import { EvolutionService } from '../services/evolution.service';
import { Evolution } from '../models/Evolution.model';
import { TokenStorageService } from '../services/token-storage.service';
import { Employe } from '../models/Employe.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-evolutioncol',
  templateUrl: './evolutioncol.component.html',
  styleUrls: ['./evolutioncol.component.scss']
})
export class EvolutioncolComponent implements OnInit {
  selectedDev;
  submitted;
  echeance: Date;
  mobilite;
  poste;
  evolution:Evolution;
  evolu:Evolution;
  selectedDevice;
  eval: boolean;
  evol:boolean;
  date: number;
  evoldep: boolean;
  id: any;
  errorMessage: any;
  employe:Employe; 
  commentairecol; avisResp;
  constructor( private employeService:EmployeService,private tokenStorageService:TokenStorageService,
    private evaluationService:EvaluationService, private evolutionService: EvolutionService
    , private formBuilder: FormBuilder,private phaseService:PhaseService) { }

  ngOnInit(): void {
    this.id= this.tokenStorageService.getUser().id;
  this.employeService.getEmployeUser(Number(this.id)).subscribe(emp => {  
    this.employe=emp;
     this.evolutionService.getEvolution(emp.codeEmploye).subscribe(evol=>{
     this.evolu=evol;  console.log("evolution  "+this.evolu);
     if(evol && evol.type>=0 && evol.type <=4){
       this.selectedDev=evol.type;
       this.poste=evol.posteSouhaite;
       this.mobilite=evol.preferenceGeo;
       this.echeance=   evol.echeanceEvolution;
       this.commentairecol=evol.commentaireCol;
       this.avisResp=evol.avisResp;
      
     }
     },
     err=>{
      this.errorMessage = err.error.message;
      console.log(this.errorMessage);
     });
     },
     err=>{
      this.errorMessage = err.error.message;
      console.log(this.errorMessage);
     });
     
    this.phaseService.getPhase().subscribe(phase => {
      if(phase.date>0){
        this.date=phase.date;
      }
      if(phase.etape >=7 && phase.etape <= 8){
        this.evoldep=true;
      if(phase.etape== 7){
        this.evol=true;
       }
            else{
              this.evol=false;
            }
      
          }else{  this.evol=false;   this.evoldep=false; }
     },
     err =>{
        console.log(err.error.message);
     });
     
  }


 onChangeDev(e){
   
    this.selectedDev=e;
  console.log(this.selectedDev);
 }

 
 Annuler(){
  this.eval=false;
}

Enregistrer(){
  switch( this.selectedDev) { 
    case "1": { 
       this.evolution=new Evolution(this.employe,this.date,1,null , null,this.echeance, this.commentairecol);
       break; 
    } 
    case "2": { 
      this.evolution=new Evolution(this.employe,this.date,2,this.poste, null,this.echeance, this.commentairecol);
       break; 
    } 
    case "3": { 
      this.evolution=new Evolution(this.employe,this.date, 3,null , this.mobilite,this.echeance, this.commentairecol);
      break; 
   } 
   case "4": { 
    this.evolution=new Evolution(this.employe,this.date, 4, null , this.mobilite,this.echeance, this.commentairecol);
    break; 
 } 
    default: { 
      this.evolution=new Evolution(this.employe,this.date,0);
       break; 
    }
 } 

 if(!this.evolu){ console.log(this.evolution);
  this.evolutionService.createEvolution(this.evolution).subscribe(res=>{
  
  },
  err=>{
    this.errorMessage = err.error.message;
    console.log(this.errorMessage);
  });
  }
  else{ 
    this.evolu.commentaireCol=this.commentairecol; this.evolu.echeanceEvolution=this.echeance;
    this.evolu.posteSouhaite=this.poste; this.evolu.preferenceGeo=this.mobilite;
    this.evolu.type=this.selectedDev;   console.log(this.selectedDev);
    this.evolutionService.updateEvolution(this.evolu).subscribe(res=>{
      console.log(this.evolu);
      this.ngOnInit();
    },
    err=>{
      this.errorMessage = err.error.message;
      console.log(this.errorMessage);
    });
  }
  this.eval=false;
}

Evoluer(){
this.eval=true;
}
}
