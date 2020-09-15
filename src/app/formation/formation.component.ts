import { Component, OnInit,OnDestroy ,ViewChild,TemplateRef} from '@angular/core';
import { Formation } from '../models/Formation.model';
import { Subscription, from } from 'rxjs';
import { FormationService } from '../services/Formation.service';
import { Router, ActivatedRoute } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatTableDataSource } from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatFormFieldControl} from '@angular/material/form-field'
import {MatPaginatorModule, MatPaginator} from '@angular/material/paginator';
import { Objectif } from '../models/Objectif.model';
import { ObjectifService } from '../services/Objectif.service';
import {MatDialog} from '@angular/material/dialog';
import { EvaluationIndividuelle } from '../models/EvaluationIndividuelle.model';
import { PhaseService } from '../services/phase.service';
import { EmployeService } from '../services/Employe.service';
import { Employe } from '../models/Employe.model';

@Component({
  selector: 'app-formation',
  templateUrl: './formation.component.html',
  styleUrls: ['./formation.component.scss']
})
export class FormationComponent implements OnInit {
  formations:Array<Formation>=new Array<Formation>();
  objinddep: boolean;
  a: string;
  selectedDevicede;
  errsaisi: boolean;
  jusification;
  objectifs:Array<EvaluationIndividuelle>=new Array<EvaluationIndividuelle>();
  add:boolean;
  formationForm: FormGroup;
  newformation:Formation;
  coll:Employe;
  date;
  objdep;
  errorMessage = '';
  loading = false;
  submitted = false;
  displayedColumns: string[] ;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  dataSource ;
  formationspass:Array<Formation>=new Array<Formation>();
  displayedColumns1: string[]= ['NumFormation', 'nomFormation','objectifPrevu','evalColl','evalResp','justification'];
  dataSource1 ;
  enableEdit=false;
  enableEditIndex; 
  updateerror=false;
  selectedDevice: any;
   intituleexiste;
   nomFormation; evalResp;
   objectifPrevu;
   nomexiste; 
   objind;  

  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  constructor(private formationService: FormationService,private formBuilder: FormBuilder,private objectifService:ObjectifService
    ,private dialog: MatDialog,private phaseService:PhaseService ,private employeService:EmployeService,
    private router:Router, private route: ActivatedRoute) { }



  callAPI(element) {
    let dialogRef = this.dialog.open(this.callAPIDialog);
    dialogRef.afterClosed().subscribe(result => {
        // Note: If the user clicks outside the dialog or presses the escape key, there'll be no result
        if (result !== undefined) {
            if (result === 'yes') {
                this.formationService.deleteFormation(element.codeFormation).subscribe(resultat=>{
                  this.ngOnInit(); 
                  console.log(resultat);
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

  ngOnInit() {
    this.add=false;
    this.a =String( this.route.parent.snapshot.params['id'] ).substring(1,String( this.route.parent.snapshot.params['id'] ).length) ; 
   
    this.employeService.getEmployeUser(Number(this.a)).subscribe(emp => {
      this.coll=emp; console.log(emp);
    this.formationService.getAllFormations(emp.codeEmploye).subscribe(formations => {
      console.log("marche  "+formations.length);
      this.dataSource  = new MatTableDataSource<Formation>(formations);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.formations=formations;
  },
err => { 
  this.errorMessage = err.error.message;
 this.loading = false;
 console.log( this.errorMessage);
}) ;
    
this.formationService.getFormationPas(emp.codeEmploye).subscribe(foms =>{
  this.dataSource1  = new MatTableDataSource<Formation>(foms);
  this.formationspass=foms;
},
err =>{
  console.log( this.errorMessage);
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
    if(phase.etape >=3 && phase.etape <=8){
      if(phase.etape == 3){
        this.objind=true;
        this.displayedColumns= ['NumFormation', 'nomFormation','objectifPrevu','demande','action2'];
      }else{
        this.objind=false;
      }
      if(phase.etape>=4 && phase.etape <=6){
        this.displayedColumns= ['NumFormation', 'nomFormation','objectifPrevu','demande'];
      }
      if(phase.etape == 7){
        this.displayedColumns= ['NumFormation', 'nomFormation','objectifPrevu','demande','evalColl','evalResp','justification','action1'];
      }
      if(phase.etape >=8){
        this.displayedColumns= ['NumFormation', 'nomFormation','objectifPrevu','demande','evalColl','evalResp','justification'];
      }
      this.objinddep=true;
    }
    else{
      this.objinddep=false;
    }
   },
   err =>{
      console.log(err.error.message);
   });

 
  }
  
  onChange(e){
    this.selectedDevice=e;
  }
  onChangede(e){
    this.selectedDevicede=e;
  }

initForm() {
  this.formationForm = this.formBuilder.group({
    nomFormation:['',Validators.required],
    objectifPrevu: ['',Validators.required ],
    demande : 'true'
  });
}
get f() { return this.formationForm.controls; }
onSubmitForm() {
  this.submitted = true;
  this.nomexiste=false;
  this.intituleexiste=false;
   // stop here if form is invalid
   if (this.formationForm.invalid) {
       return;
   }
 
  const formValue = this.formationForm.value;
  this.newformation=new Formation(formValue['nomFormation'],formValue['objectifPrevu'], this.date,this.coll,formValue['demande']);
  console.log(this.newformation);
  this.loading = true;
   this.formationService.createFormation(this.newformation).subscribe( form => {
     
      this.add=false;  
      this.ngOnInit(); 
   },
   err => {
    
     this.errorMessage = err.error.message;
     this.loading = false;
     /*
     if(this.errorMessage=="Fail -> Name Formation Already Exists!"){
      this.nomexiste=true;
      }
      */
   });
   this.submitted=false;
  
}

ajouterFormation(){
  this.initForm();
  this.add=!this.add;    
}

onSupprimerFormation(formation:Formation){

}

onModifierFormation(formation:Formation){

}
  Annuler(){
    this.intituleexiste=false;
    this.loading=false;
    this.submitted=false;
    this.add=false;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  enableEditMethod(e, i,element) {
  this.errsaisi=false;
 if(element.evalResp >=1 && element.evalResp <=4){ this.selectedDevice=element.evalResp;  }
   
    this.enableEdit = true;
    this.enableEditIndex = i;
    console.log(i, e);
  }

  saveSegment(element){ 
 if(!this.selectedDevice || this.selectedDevice=="" ){
    this.errsaisi=true;
    }else{
      this.errsaisi=false;
      element.evalResp= this.selectedDevice; console.log("a "+this.selectedDevice);
    this.formationService.updateFormation(element).subscribe(formation => {
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
  delete(e,codeFormation){
  }

 

}
