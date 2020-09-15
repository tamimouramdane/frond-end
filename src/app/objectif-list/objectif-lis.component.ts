import { Component, OnInit,OnDestroy ,ViewChild,TemplateRef} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FilialeService } from '../services/Filiale.service';
import { DirectionService } from '../services/Direction.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Division } from '../models/Division.model';
import { DivisionService } from '../services/Division.service';
import { Filiale } from '../models/Filiale.model';
import { Direction } from '../models/Direction.model';
import { Service } from '../models/Service.model';
import { ServiceService } from '../services/Service.service';
import {Poste} from'../models/Poste.model';
import { Objectif } from '../models/Objectif.model';
import { ObjectifService } from '../services/Objectif.service';
import { Evaluation } from '../models/Evaluation.model';
import { EvaluationService } from '../services/Evaluation.service';
import { MatTableDataSource } from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginatorModule, MatPaginator} from '@angular/material/paginator';
import { EvaluationIndividuelle } from '../models/EvaluationIndividuelle.model';
import { concat } from 'rxjs';
import { EmployeService } from '../services/Employe.service';
import { Employe } from '../models/Employe.model';
import { PhaseService } from '../services/phase.service';
import { Ponderation } from '../models/Ponderation.model';
import { ValidationService } from '../services/Validation.service';
@Component({
  selector: 'app-objectif-list',
  templateUrl: './objectif-list.component.html',
  styleUrls: ['./objectif-list.component.scss']
})
export class ObjectifListComponent implements OnInit {
  enableEditIndIndex;  enableEditCol; enableEditColIndex;
  objectifForm:FormGroup;
  divisions:Array<Division>=new Array<Division>();
  filiales:Array<Filiale>=new Array<Filiale>();
  ponderations:Array<Ponderation>=new Array <Ponderation>();
  directions: Direction[];
  services: Service[];
  postes: Poste[];
  evaluations:Array<Evaluation>=new Array<Evaluation>();
  posteexistante:boolean=false;
  objcollemp:boolean=false;
  niv:number=1;
  newobjectif:Objectif;
  position:Position;
  division:Division;
  filiale:Filiale;
  date;
  pond1; pond2; pond3;
  action1; action2; action3;
  direction:Direction;
  service:Service;
  type:boolean;
  selectedDevice='individuel';
  newevaluation:Evaluation;
  add:boolean;
  evaluationGroupe:Evaluation;
  evas:Array<Evaluation>=new Array<Evaluation>();
  evalempcol:Array<Evaluation>=new Array<Evaluation>();
  evaDivision:Evaluation[];
  evaFiliales:Array<Evaluation>=new Array<Evaluation>();
  objectifsInd:Array<Objectif>=new Array<Objectif>();
   errorMessage = '';
   loading = false;
   submitted = false;
   existe:boolean=false;
   objectifexiste:boolean;
   objcoll:boolean;
   emp:Employe;
   sommepond:number;
   displayedColumns: string[] = ['typeobjectif','intituledivfil','objectif','ponderation','plandaction'];
   @ViewChild('paginator', {static: true}) paginator: MatPaginator;
   @ViewChild(MatSort, {static: true}) sort: MatSort;
   
   dataSource ; 
   dataSource1 ;
   displayedColumns1: string[] = ['typeobjectif','intituledivfil','objectif','kpi','cible','action1','action2'];
   @ViewChild('paginator1', {static: true}) paginator1: MatPaginator;
   @ViewChild(MatSort, {static: true}) sort1: MatSort;
   dataSource2 ;
   displayedColumns2: string[] = ['typeobjectif','intituledivfil','objectif','ponderation','plandaction','action1'];
 
   displayedColumns4: string[] = ['Numobjectif', 'intituleObjectif', 'ponderation','plandaction','kpi','cible',
   'echeancierDeRealisation','tauxAtteinte','action1'];
   dataSource4;
   enableEdit=false;
   enableEditIndex;
   typeobjectif; intituledivfil; intituleObjectif; ponderation; plandaction ;kpieva ;cible;
   obj ;  
   kpiv; ciblev;
   fixcol:boolean;
   fix:boolean;
   enableEditIndexInd;  enableEditInd;
   employes:Array<Employe>=new Array<Employe>();
   @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  objcolfix: boolean;
  elemch: boolean;
  remptout: any;
  ponderr: boolean;
  sompond: boolean;
  choix: number;
  enableEditEval: boolean;
  enableEditEvalIndex: any;
  phase: number;
  evalMiParcours: any;
  evalFinale: any;
  etape: number;
  choisi: boolean;
  nonchoisi: boolean;
  echeancierDeRealisation: any;
  champnonremp: boolean;
  pondfaussemod: boolean;
  sommefaussemod: boolean;
  lastpond: number;
  validation: string;
  constructor(private formBuilder: FormBuilder,private divisionService: DivisionService, 
    private router:Router,private filialeService: FilialeService,
    private objectifService : ObjectifService, private evaluationService:EvaluationService
    ,private dialog: MatDialog,private employeService: EmployeService,private phaseService:PhaseService ,
    private validationService: ValidationService){ 
     
    }



   callAPIEva(element) {
    let dialogRef = this.dialog.open(this.callAPIDialog);
    dialogRef.afterClosed().subscribe(result => {
        // Note: If the user clicks outside the dialog or presses the escape key, there'll be no result
        if (result !== undefined) {
            if (result === 'yes') {
                this.evaluationService.deleteEvaluation(element.codeEvaluation).subscribe(resultat=>{
                  this.ngOnInit(); 
                },
                err => {
                  this.errorMessage = err.error.message;
                  console.log('erreur  '+ this.errorMessage);
                });
               
            } else if (result === 'no') {
                // TODO: Replace the following line with your code.
                console.log('User clicked no.');
            }
        }
    });
  }


  ngOnInit(): void {
    this.add=false;
   
    this.evaluationService.getAllEvaluations().subscribe(evaluations =>{
      this.evaluations=evaluations.filter (eva=>eva.typeEvaluation===true);
      console.log('long '+this.evaluations.length);
      
     this.evaluationGroupe=this.evaluations.find(eva => !eva.objectif.position );
     this.evaFiliales=this.evaluations.filter(eva =>eva.objectif.position&& eva.objectif.position.type==='filiale');
    this.evaDivision=this.evaluations.filter(eva =>eva.objectif.position&& eva.objectif.position.type==='division');

    if(this.evaluationGroupe){
    this.evas.push(this.evaluationGroupe);  }
    /*
    for(let evaluation of this.evaluations){
      if(evaluation.objectif.position&&evaluation.objectif.position.type==='division'){ this.evas.push(evaluation)}
    }
    for(let evaluation of this.evaluations){
      if(evaluation.objectif.position&&evaluation.objectif.position.type==='filiale'){ this.evas.push(evaluation)}
    } 
    */
      this.dataSource1  = new MatTableDataSource<Evaluation>(this.evaluations);
    this.dataSource1.paginator = this.paginator1;
    this.dataSource1.sort = this.sort1;
    console.log('groupe '+this.evaluationGroupe);
  

    this.divisionService.getAllDivisions().subscribe(divisions => {
      this.divisions = divisions;
   
    this.filialeService.getAllFiliales().subscribe(filiales => {
      this.filiales = filiales;
 
  
   if(this.evaluations.length== ( this.divisions.length+this.filiales.length +1) ){
   this.objcollemp=true;
   console.log('a '+this.evaluations.length +' b '+ this.divisions.length +' c '+this.filiales.length );
   }
   else{
    this.objcollemp=false;
   }

  } );
  });
    });  
  
   
    
  this.employeService.getAllEmployes().subscribe(employes => {
    this.employes=employes;
  });
 
  this.phaseService.getPhase().subscribe(phase => {  this.phase=phase.etape;
    if(phase.date>0){
      this.date=phase.date;
    }
 
      if(phase.etape >=3 && phase.etape <=10){
       
        this.objcoll=true; 
        this.objcolfix=false;
        if(phase.etape <=4){
         this.displayedColumns1 = ['typeobjectif','intituledivfil','objectif','kpi','cible','action1'];
        }
        if(phase.etape >=5){
        if(phase.etape== 5){
          this.displayedColumns1  = ['typeobjectif','intituledivfil','objectif','kpi','cible','evalMiParcours','action3'];
         }
        if(phase.etape == 6){
          this.displayedColumns1  = ['typeobjectif','intituledivfil','objectif','kpi','cible','evalMiParcours','action1']; 
        }    
          }

          if(phase.etape >=7){
         if(phase.etape==7){
          this.displayedColumns1  = ['typeobjectif','intituledivfil','objectif','kpi','cible','evalFinale','action3'];
         } else{
          this.displayedColumns1  = ['typeobjectif','intituledivfil','objectif','kpi','cible','evalFinale','action1'];
         }    
        }
      }
      else{
        if(phase.etape==2){
          this.objcoll=true; 
        }
        else{
        this.objcoll=false;
        }
        this.objcolfix=true;
      }
   },
   err =>{
      console.log(err.error.message);
   });
}

initForm() {
  this.objectifForm = this.formBuilder.group({
    nomobjectif: ['',Validators.required ],
    division: 'aucune',
    filiale: 'aucune',
    kpi:['',Validators.required],
    cible:['',Validators.required]
  });
}

ajouterObjectif(){
  this.initForm();
  this.add=!this.add;    
}

onChange(newValue) {
  this.selectedDevice = newValue;
  if(newValue ==""){
    this.elemch=false;
  }else{
    this.elemch=true;
  }
  var array = newValue.split(" -- ");
 this.emp= this.employes.find(employe => ( employe.nom == array[0] && employe.prenom == array[1]));
 console.log(this.emp);  
 if(this.emp){
 
   this.evaluationService.getAllPonderations(this.emp.codeEmploye).subscribe(ponds=>{
  
    if(!ponds || ponds.length ==0){
     
      this.choix=1;
      this.evaluationService.getEvalsCollect(this.emp.poste.position.codePosition).subscribe(evals=>{
        console.log("nombre "+evals.length);
        this.evalempcol=evals;
        this.dataSource  = new MatTableDataSource<Evaluation>(evals);
      },
      err=>{
        console.log(err.error.message);  
      });

    }else{
      this.choix=2;
    this.dataSource2  = new MatTableDataSource<Ponderation>(ponds);
    this.ponderations=ponds;  console.log('trs4');
    }

   },
   err =>{
    console.log(err.error.message);  console.log('trs5');
   });
  
   this.evaluationService.getAllEvaluation(String(this.emp.codeEmploye)).subscribe(evas => {
    this.dataSource4  = new MatTableDataSource<EvaluationIndividuelle>(evas);
  
      this.evaluations=evas;     console.log('ajout');
    });

    this.evaluationService.getSommePond(this.emp.codeEmploye).subscribe(som=>{
      this.sommepond=som;
      },
      err =>{
        console.log(err.error.message);  
       });
       this.validationService.getValidation(this.emp.codeEmploye).subscribe(val=>{
        if(val.valCol && val.valResp){console.log("valide");  this.validation="Validé"; }
        else{console.log("non valide");  this.validation="En cours de validation";  } 
        },
        err => {
          this.errorMessage = err.error.message;
          console.log('erreur  '+ this.errorMessage);
          this.validation="En cours de validation"; 
        });
 }
  
}

get f() { return this.objectifForm.controls; }
   onSubmitForm() {
     this.submitted = true;
     this.existe=false;
     this.objectifexiste=false;
  this.nonchoisi=false;
     const formValue = this.objectifForm.value;
  if(formValue['nomobjectif'].replace(/\s/g, "") ==="" ){
    this.objectifForm.controls['nomobjectif'].setErrors({required:true});
    return;
  }
  if(formValue['kpi'].replace(/\s/g, "") ==="" ){
    this.objectifForm.controls['kpi'].setErrors({required:true});
    return;
  }

  if(formValue['cible'].replace(/\s/g, "") ==="" ){
    this.objectifForm.controls['cible'].setErrors({required:true});
    return;
  }

      // stop here if form is invalid
      if (this.objectifForm.invalid) {
          return;
      }
    if(formValue['filiale'] == 'aucune' && formValue['division'] == 'aucune' ){
  this.nonchoisi=true; }
  else{
  this.type =true;
      if(formValue['filiale'] != 'aucune'){
        this.filiale=this.filiales.filter (filiale => filiale.intitulePosition == formValue['filiale'])[0] ;
        this.filiale.type='filiale';
        this.newobjectif= new Objectif(formValue['nomobjectif'],this.type,this.filiale);
     
        }
       else{
        if(formValue['division'] != 'aucune'){
          if(formValue['division'] == 'groupe'){ 
            this.newobjectif = new Objectif(formValue['nomobjectif'],this.type); console.log('grp');
          }
          else{
       this.division= this.divisions.filter (division => division.intitulePosition == formValue['division'])[0] ;
       this.division.type='division';

        this.newobjectif = new Objectif(formValue['nomobjectif'],this.type,this.division);
          }
        }
        else{
        
        }
       } 
   
   this.newevaluation=new Evaluation( this.newobjectif, true, formValue['kpi'], formValue['cible'],this.date);
    console.log(this.newevaluation);
  this.evaluationService.createEvaluation(this.newevaluation).subscribe(evaluation =>{
    this.add=false; 
     this.ngOnInit();
    },
    err => {
      this.errorMessage = err.error.message;
      this.loading = false;
      console.log('erreur '+this.errorMessage);
      if(err.error.message=="Erreur -> une evaluation globale existe deja cette annee!!"){
        this.existe=true;
      }
      
      if(err.error.message=="Erreur -> une evaluation de division/filiale existe deja cette annee!!"){
        this.existe=true;
      }
      /*
      if(err.error.message=="objectifexiste"){
        this.objectifexiste=true;
        this.objectifForm.controls['nomobjectif'].setErrors({required:true});
      }*/
    });
  console.log(this.newevaluation);
  this.submitted = false;
    }
  }
 
  Annuler(){
    this.objectifexiste=false;
    this.existe=false;
    this.loading=false;
    this.submitted=false;
  this.nonchoisi=false;
    this.add=!this.add;
  }
  
    
  applyFiltercol(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource1.filter = filterValue.trim().toLowerCase();
  }

  enableEditColMethodcol(e, i,element) {
    this.ciblev=false;  this.kpiv=false;
    if(this.etape == 2){
  this.displayedColumns1.pop();  }
  if(element.objectif){
   
   if(element.position){ 
    this.typeobjectif=element.objectif.position.type;
     this.intituledivfil=element.objectif.position.intitulePosition; }
     else{
       this.typeobjectif='groupe';
     }
     this.intituleObjectif=element.objectif.nomObjectif;  }
   this.kpieva=element.kpi;
   this.cible=element.cible;

    this.enableEditCol = true;
    this.enableEditColIndex = i;
    console.log(i, e);
  }

  saveSegmentcol(element){
    if(this.kpieva.replace(/\s/g, "") ===""  || this.cible.replace(/\s/g, "") ===""){
    if(this.kpieva.replace(/\s/g, "") ===""  ){
       this.kpiv=true;
    }
      if(this.cible.replace(/\s/g, "") ==="" ){
       this.ciblev=true;
      }
      return;
    }
        element.objectif.nomObjectif=this.intituleObjectif; element.kpi=this.kpieva;
        element.cible=this.cible;
      this.evaluationService.updateEvaluation(element).subscribe(eva => {
        this.ngOnInit(); 
     },
     err => {
       this.errorMessage = err.error.message;
     });
     if(this.etape == 2){
     this.displayedColumns1.push('action2');  }
      this.enableEditCol = false;
      this.enableEditColIndex = null;
      
    

  }
  cancelcol(i){
    if(this.etape == 2){
      this.displayedColumns1.push('action2');  }
    this.enableEditCol = false;
    this.enableEditColIndex = null;
  }
  
  
  
  deletecol(e,codeDivision){
   
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  enableEditIndMethod(e, i,element) {
  
   this.ponderation=element.ponderation;
   this.plandaction=element.planAction;
 this.enableEditInd = true;
    this.enableEditIndIndex = i;
    console.log(i, e);
  }

  saveSegmentInd(element){
    if(this.plandaction =='' ){


    }
    else {
     
    element.ponderation=this.ponderation;
    element.planAction=this.plandaction;

    this.evaluationService.updatePonderation(element).subscribe(
      resl=>{
        this.ngOnInit();
      },
      err=>{
        console.log(err.error.message);  
      }
    );

    this.enableEditInd = false;
    this.enableEditIndIndex = null;
  }
  }
  cancelInd(i){
    this.enableEditInd = false;
    this.enableEditIndIndex = null;
  }
  
  AnnulerF(){
    this.fix=false;
  }

  Enregistrer(){
 
   if(Number(this.pond1) + Number(this.pond2) +Number(this.pond3)) {
     this.sompond = false;
   }
   else{
    console.log(new Ponderation(this.emp,this.evalempcol[0],this.pond1, this.action1));
   this.evaluationService.createPonderation(new Ponderation(this.emp,this.evalempcol[0],this.pond1, this.action1)).subscribe(
     res =>{
       
     },
     err=>{
      this.errorMessage = err.error.message;
     });

     if(this.evalempcol && this.evalempcol[1]){ console.log(new Ponderation(this.emp,this.evalempcol[1],this.pond2, this.action2));
     this.evaluationService.createPonderation(new Ponderation(this.emp,this.evalempcol[1],this.pond2, this.action2)).subscribe(
      res =>{
        
      },
      err=>{
       this.errorMessage = err.error.message;
      });
    }
    if(this.evalempcol && this.evalempcol[2]){ console.log(new Ponderation(this.emp,this.evalempcol[2],this.pond3, this.action3));
      this.evaluationService.createPonderation(new Ponderation(this.emp,this.evalempcol[2],this.pond3, this.action3)).subscribe(
       res =>{
         
       },
       err=>{
        this.errorMessage = err.error.message;
       });
     }
      this.ponderr=false;
      this.remptout=true;
      this.fix=false;
    }
     // this.ngOnInit();
  }
  
  Fixer(){
    this.ponderr=false;
    this.remptout=true;
    this.sompond=true;
    /*
    this.pond1=''; this.pond2=''; this.pond3=''; 
    this.action1=''; this.action2=''; this.action3='';
    */
  this.fix=true;
  
  }



  
  enableEditEvalMethod(e, i,element) {
 if(this.phase==5){
    this.evalMiParcours=element.evalMiParcours;
 }
 if(this.phase==7){
this.evalFinale =   element.evalFinale;
 }

    this.enableEditEval = true;
    this.enableEditEvalIndex = i;
    console.log(i, e);
  }

  saveSegmentEval(element){
   
    if(this.phase==5){
      element.evalMiParcours=this.evalMiParcours;
   }
   if(this.phase==7){
    element.evalFinale=this.evalFinale;
   }
   console.log(element);
  
      this.evaluationService.updateEvaluation(element).subscribe(eva => {
        console.log(element);
        this.ngOnInit(); 
     },
     err => {
       this.errorMessage = err.error.message;
     });
    
      this.enableEditEval = false;
      this.enableEditEvalIndex = null;
      
    

  }
  cancelEval(i){
    this.enableEditEval = false;
    this.enableEditEvalIndex = null;
  }
 

  
  enableEditMethod(e, i,element) {
    this.sommefaussemod= false;  
    this.champnonremp=false;  this.pondfaussemod=false;
    if(element.objectif){ this.intituleObjectif=element.objectif.nomObjectif;  }
     this.ponderation=element.ponderation;
     this.lastpond=element.ponderation;
     this.plandaction=element.planAction
     this.kpieva=element.kpi;
     this.cible=element.cible;
     this.echeancierDeRealisation=element.echeancierDeRealisation;
      this.enableEdit = true;
      this.enableEditIndex = i;
      console.log(i, e);
    }
  
    saveSegment(element){
      if(this.intituleObjectif=='' ||this.ponderation=='' || this.plandaction =='' || this.kpieva=='' 
      || this.cible=='' ){
        this.champnonremp=true;   
      }else{
        if(isNaN(Number(this.ponderation)) || Number(this.ponderation) > 100 || Number(this.ponderation) < 0){
          this.pondfaussemod=true;
        }
      else{
          if(Number(this.sommepond) + Number(this.ponderation) - Number(this.lastpond) > 100){
            this.sommefaussemod=true;
        }else{
          this.sommepond=Number(this.sommepond) +Number(this.ponderation) - Number(this.lastpond);
        element.objectif.nomObjectif=this.intituleObjectif;
        element.ponderation=this.ponderation;
        element.planAction =this.plandaction;
        element.kpi=this.kpieva;
        element.cible=this.cible;
        element.echeancierDeRealisation=this.echeancierDeRealisation;
        this.objectifService.updateObjectif( element.objectif).subscribe(eva => {
           
       },
       err => {
         this.errorMessage = err.error.message;
       });
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
      }
    }

    cancel(i){
      this.enableEdit = false;
      this.enableEditIndex = null;
    }
    delete(e,codeDivision){
      
    }
}