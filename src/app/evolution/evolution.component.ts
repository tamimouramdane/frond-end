import { Component, OnInit } from '@angular/core';
import { PhaseService } from '../services/phase.service';
import { EmployeService } from '../services/Employe.service';
import { EvaluationService } from '../services/Evaluation.service';
import { FormBuilder } from '@angular/forms';
import { EvolutionService } from '../services/evolution.service';
import { Evolution } from '../models/Evolution.model';
import { TokenStorageService } from '../services/token-storage.service';
import { Employe } from '../models/Employe.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-evolution',
  templateUrl: './evolution.component.html',
  styleUrls: ['./evolution.component.scss']
})
export class EvolutionComponent implements OnInit {

  selectedDev;
  submitted;
  echeance: Date= new Date(12,11 ,1950);
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
  coll:Employe; 
  commentairecol; avisResp;
  type;
  ty: number;
  constructor( private employeService:EmployeService,private tokenStorageService:TokenStorageService,
    private evaluationService:EvaluationService, private evolutionService: EvolutionService
    , private formBuilder: FormBuilder,private phaseService:PhaseService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.coll=this.employeService.getcollselec();
    this.id =String( this.route.parent.snapshot.params['id'] ).substring(1,String( this.route.parent.snapshot.params['id'] ).length) ; 
   
   
  this.employeService.getEmployeUser(Number(this.id)).subscribe(emp => { 
    this.coll=emp;
     this.evolutionService.getEvolution(emp.codeEmploye).subscribe(evol=>{
     this.evolu=evol;
     if(evol && evol.type>=0 && evol.type <=4){
       this.ty=evol.type;
       switch(evol.type){
         case 0 : { this.type="aucune"; break;  }
         case 1 : { this.type="Plus de responsabilité"; break;  }
         case 2 : { this.type="Changement de fonction (métier)"; break;  }
         case 3 : { this.type="Mobilité Nationale"; break;  }
         case 4 : { this.type="Mobilité à l'international"; break;  }
       }
       this.poste=evol.posteSouhaite;
       this.mobilite=evol.preferenceGeo;
       this.echeance=evol.echeanceEvolution;
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
      if(phase.etape >=7 && phase.etape <= 8 ){
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
   
    this.selectedDevice=e;
  console.log(this.selectedDevice);
 }

 
 Annuler(){
  this.eval=false;
}

Enregistrer(){
 
 if(this.evolu){
   this.evolu.avisResp=this.avisResp; console.log("a "+this.evolu.avisResp);
  this.evolutionService.updateEvolution(this.evolu).subscribe(res=>{
    console.log("a "+this.evolu);
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
