import { Component, OnInit ,ViewChild,TemplateRef,Input,Output,EventEmitter} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { CanActivate, ActivatedRoute, Router } from '@angular/router';
import { EmployeService } from '../services/Employe.service';
import { Evaluation } from '../models/Evaluation.model';
import { Employe } from '../models/Employe.model';
import { Objectif } from '../models/Objectif.model';
import { FormGroup, FormBuilder ,Validators} from '@angular/forms';

import { from } from 'rxjs';
import { EvaluationService } from '../services/Evaluation.service';
import { EvaluationIndividuelle } from '../models/EvaluationIndividuelle.model';
import { TokenStorageService } from '../services/token-storage.service';
import { User } from '../models/User.model';
import { Route } from '@angular/compiler/src/core';
import { Service } from '../models/Service.model';
import { ObjectifService } from '../services/Objectif.service';
import { MatTableDataSource } from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatFormFieldControl} from '@angular/material/form-field'
import {MatPaginatorModule, MatPaginator} from '@angular/material/paginator';
import { PhaseService } from '../services/phase.service';
import { Ponderation } from '../models/Ponderation.model';
import { FixationcolComponent } from '../fixationcol/fixationcol.component';


@Component({
  selector: 'app-fixation',
  templateUrl: './fixation.component.html',
  styleUrls: ['./fixation.component.scss']
})
export class FixationComponent implements OnInit {
id:number;
a:string;
ajoutpossible:boolean;
evaluations:Array<EvaluationIndividuelle>=new Array<EvaluationIndividuelle>();
  employe:Employe;
  add:boolean;
  objectifForm:FormGroup;
  neweva:EvaluationIndividuelle;
  user:User;
  moinstrois:string;
  date;
    nomobj:string;
    pond:number;
    plan:string;
   kpi:string;
   evaldiv:Evaluation;
   errorMessage = '';
   loading = false;
   submitted = false;
   evacollectifs:Array<Evaluation>=new Array<Evaluation>();
   ponderations:Array<Ponderation>=new Array<Ponderation>();
   evaluationGroupe:Evaluation; 
   objind;
   evaluationFil:Evaluation;
   objectifs:Array<Objectif>=new Array<Objectif>();
   objchoisi;
   pondjuste:boolean;
   selectedDev:Objectif;
   evaluationDiv:Evaluation;
   displayedColumns: string[] = ['Numobjectif', 'intituleObjectif', 'ponderation','plandaction','kpi','cible',
   'echeancierDeRealisation','tauxAtteinte','action1','action2'];
   displayedColumns1: string[] = ['typeobjectif','intituledivfil','objectif', 'ponderation','plandaction','kpi','cible'];
   @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
   @ViewChild(MatSort, {static: true}) sort: MatSort;
   dataSource ;
   dataSource1 ;

   dataSource2 ;
   displayedColumns2: string[] = ['typeobjectif','intituledivfil','objectif','ponderation','plandaction','kpi','cible'];
   enableEdit=false;
   enableEditIndex;
   intituleObjectif; ponderation; plandaction ;kpieva ;cible;
   echeancierDeRealisation:Date ;
   coll:Employe;
   @Output() messageEvent = new EventEmitter<boolean>();
   @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  objectifexiste: boolean;
  objdep: boolean;
  pondfausse: boolean;
  sommefausse: boolean;
  sommepond: number;
  champnonremp: boolean;
  sommefaussemod: boolean;
  pondfaussemod: boolean;
  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder ,
    private employeService:EmployeService, private evaluationService:EvaluationService
    , private evaluationService2:EvaluationService,private tokenStorageService:TokenStorageService,
    private router:Router,private objectifService:ObjectifService ,private dialog: MatDialog
    ,private phaseService:PhaseService) { 
     
  }

callAPI(element) {
      let dialogRef = this.dialog.open(this.callAPIDialog);
      dialogRef.afterClosed().subscribe(result => {
          // Note: If the user clicks outside the dialog or presses the escape key, there'll be no result
          if (result !== undefined) {
              if (result === 'yes') {
                  this.evaluationService.deleteEvaluationInd(element.codeEvaluation).subscribe(resultat=>{
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
     this.a =String( this.route.parent.snapshot.params['id'] ).substring(1,String( this.route.parent.snapshot.params['id'] ).length) ; 
     console.log('a   '+this.a); 
  /*  this.coll=this.employeService.getcollselec(); */

     this.employeService.getEmployeUser(Number(this.a)).subscribe(emp => {
    this.coll=emp;
    this.evaluationService.getAllPonderations( this.coll.codeEmploye).subscribe(ponds=>{
       this.dataSource2  = new MatTableDataSource<Ponderation>(ponds);
      this.ponderations=ponds;  
     },
     err =>{
      console.log(err.error.message);  
     });
  
     this.evaluationService.getAllEvaluation(String(this.coll.codeEmploye)).subscribe(evas => {
      this.dataSource  = new MatTableDataSource<EvaluationIndividuelle>(evas);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
        this.evaluations=evas;     console.log('ajout');
      });
      this.evaluationService.getSommePond(emp.codeEmploye).subscribe(som=>{
      this.sommepond=som;
      },
      err =>{
        console.log(err.error.message);  
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
    if(phase.etape>=3 && phase.etape <=10){
       this.objdep=true;
    }else{
      this.objdep=false;
    }

    if(phase.etape== 3){
      this.objind=true;
          }
          else{
            this.objind=false;
          }
     if(phase.etape >=4 && phase.etape <=8) {
       this.displayedColumns.pop();
       this.displayedColumns.pop();
       if(phase.etape == 6){
        this.displayedColumns2 = ['typeobjectif','intituledivfil','objectif', 'ponderation','plandaction','kpi','cible','evalMiParcours'];
       }
       if(phase.etape == 8){
        this.displayedColumns2 = ['typeobjectif','intituledivfil','objectif', 'ponderation','plandaction','kpi','cible','evalFinale'];
       }
     }    
   },
   err =>{
      console.log(err.error.message);
   });
   
  }

  initForm() {
    this.objectifForm = this.formBuilder.group({
      nomobjectif: ['',Validators.required ],
      ponderation: ['',Validators.required/*,Validators.min(1),Validators.max(100)*/],
      plandaction:['',Validators.required],
      kpi:['',Validators.required],
      cible:['',Validators.required],
      echeancier:['',Validators.required]
    });
  }

  ajouterObjectif(){
    this.objchoisi='';
    this.initForm();
    this.add=!this.add;    
  }

  
  get f() { return this.objectifForm.controls; }
  onSubmitForm() {
    this.submitted = true;
    this.pondjuste=true;
    this.pondfausse =false;
    const formValue = this.objectifForm.value;
    if(formValue['nomobjectif'].replace(/\s/g, "") ==="" ){
      this.objectifForm.controls['nomobjectif'].setErrors({required:true});
     
    }
    if(formValue['ponderation'].replace(/\s/g, "") ==="" ){
   
      this.objectifForm.controls['ponderation'].setErrors({required:true});
    }
    
    if(isNaN(Number(formValue['ponderation'])) || Number(formValue['ponderation'])>100 || Number(formValue['ponderation']) < 1 ){
      this.pondjuste=false;
      this.objectifForm.controls['ponderation'].setErrors({maxlength:true});
      
    }
    
   if(this.sommepond + Number(formValue['ponderation']) > 100){
     this.sommefausse=true;
    this.objectifForm.controls['ponderation'].setErrors({maxlength:true});
   }

    if(formValue['plandaction'].replace(/\s/g, "") ==="" ){
      this.objectifForm.controls['plandaction'].setErrors({required:true});
     
    }
    if(formValue['kpi'].replace(/\s/g, "") ==="" ){
      this.objectifForm.controls['kpi'].setErrors({required:true});
    
    }
  
    if(formValue['cible'].replace(/\s/g, "") ==="" ){
      this.objectifForm.controls['cible'].setErrors({required:true});
    
    }
     if (this.objectifForm.invalid) {
         return;
     }
   
   
    this.neweva=new EvaluationIndividuelle(new Objectif(formValue['nomobjectif'] , false) ,false, formValue['kpi']
     , formValue['cible'],this.date, formValue['ponderation'] , formValue['plandaction'] ,
     formValue['echeancier']   ,this.coll  );
    console.log(this.neweva);
    this.evaluationService2.createEvaluationInd(this.neweva).subscribe( 
      ev => {  
     

    this.ngOnInit();
              },
       err => { 
           this.errorMessage = err.error.message;
          this.loading = false;
          if(err.error.message=="objectifexiste"){
            this.objectifexiste=true;
          }
         });
         this.submitted = false;
    this.add=!this.add; 
    }

     
   

    Annuler(){
      this.loading=false;
      this.submitted=false;
      this.pondfausse =false;
      this.add=!this.add;
    }
    onChangeDev(e){
       
      this.selectedDev=e;
      this.objchoisi=this.selectedDev;
      console.log('aaaa' +e)
    }
    onChoisir(objectif:Objectif){
      this.objchoisi=objectif.nomObjectif;
    }
    
    
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  enableEditMethod(e, i,element) {
    this.sommefaussemod= false;  
    this.champnonremp=false;  this.pondfaussemod=false;
  this.displayedColumns.pop();
  if(element.objectif){ this.intituleObjectif=element.objectif.nomObjectif;  }
   this.ponderation=element.ponderation;
   this.plandaction=element.planAction;
   this.kpieva=element.kpi;
   this.cible=element.cible;
   this.echeancierDeRealisation=element.echeancier;
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
        if(this.sommepond + Number(this.ponderation) > 100){
          this.sommefaussemod=true;
      }else{
      element.objectif.nomObjectif=this.intituleObjectif;
      element.ponderation=this.ponderation;
      element.planAction =this.plandaction;
      element.kpi=this.kpieva;
      element.cible=this.cible;
      element.echeancier=this.echeancierDeRealisation;
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
  
   this.displayedColumns.push('action2');
    this.enableEdit = false;
    this.enableEditIndex = null;
  }
  }
}
  }
  cancel(i){
  
    this.displayedColumns.push('action2');
    this.enableEdit = false;
    this.enableEditIndex = null;
  }
  delete(e,codeDivision){
    console.log('codeDivision   '+codeDivision);
  }

  eventHandler(){
  if(this.f.ponderation.value== "" || isNaN(Number(this.f.ponderation.value))  
  || this.f.ponderation.value <=0 || this.f.ponderation.value >100 ){
    this.pondfausse =true;
    return;
  }
  if( this.sommepond + Number(this.f.ponderation.value) > 100 ){
   this.sommefausse= true; 
   return;
  }
  this.pondfausse =false;
  this.sommefausse= false;
 
  }
}

