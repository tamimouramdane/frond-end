import { Component, OnInit,OnDestroy ,ViewChild,TemplateRef} from '@angular/core';
import { Formation } from '../models/Formation.model';
import { Subscription, from } from 'rxjs';
import { FormationService } from '../services/Formation.service';
import { Router } from '@angular/router';

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
import { TokenStorageService } from '../services/token-storage.service';

@Component({
  selector: 'app-formationcol',
  templateUrl: './formationcol.component.html',
  styleUrls: ['./formationcol.component.scss']
})
export class FormationcolComponent implements OnInit {

  formations:Array<Formation>=new Array<Formation>();
  date: any;
  id: any;
  objind: boolean;
  objinddep: boolean;
  errsaisi: boolean;
  formationspass:Array<Formation>=new Array<Formation>();
  displayedColumns1: string[]= ['NumFormation', 'nomFormation','objectifPrevu','evalColl','evalResp','justification'];
  dataSource1 ;
  objectifs:Array<EvaluationIndividuelle>=new Array<EvaluationIndividuelle>();
  add:boolean;
  formationForm: FormGroup;
  newformation:Formation;
  errorMessage = '';
  loading = false;
  submitted = false;
  displayedColumns: string[] = ['NumFormation', 'nomFormation','objectifPrevu','demande','action1'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  dataSource ;
  enableEdit=false;
  enableEditIndex; 
  updateerror=false;
  selectedDevice: any;
   intituleexiste;
   evalColl;
   jusification;
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  constructor(private formationService: FormationService,private formBuilder: FormBuilder,private objectifService:ObjectifService
    ,private dialog: MatDialog ,private phaseService:PhaseService, private employeService:EmployeService,
    private tokenStorageService: TokenStorageService) { }



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
    this.id= this.tokenStorageService.getUser().id;
    this.employeService.getEmployeUser(Number(this.id)).subscribe(emp => {
    this.formationService.getAllFormations(emp.codeEmploye).subscribe(formations => {
      this.dataSource  = new MatTableDataSource<Formation>(formations);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.formations=formations;
    },
    err =>{
      console.log( this.errorMessage);
    });

      this.formationService.getFormationPas(emp.codeEmploye).subscribe(foms =>{
        this.dataSource1  = new MatTableDataSource<Formation>(foms);
        this.formationspass=foms;
      },
      err =>{
        console.log( this.errorMessage);
      });
    },
    err =>{
      console.log( this.errorMessage);
    });
    this.phaseService.getPhase().subscribe(phase => {
      if(phase.date>0){
        this.date=phase.date;
      }
      if(phase.etape >=3 && phase.etape <=8){
        if(phase.etape == 3){
          this.objind=true;
          this.displayedColumns= ['NumFormation', 'nomFormation','objectifPrevu','demande'];
        }else{
          this.objind=false;
        }
        if(phase.etape>=4 && phase.etape <=6){
          this.displayedColumns= ['NumFormation', 'nomFormation','objectifPrevu','demande'];
        }
        if(phase.etape == 7){
          this.displayedColumns= ['NumFormation', 'nomFormation','objectifPrevu','demande','evalColl','evalResp','jusification','action1'];
        }
        if(phase.etape >=8){
          this.displayedColumns= ['NumFormation', 'nomFormation','objectifPrevu','demande','evalColl','evalResp','jusification'];
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
 
    if(element.evalColl >=1 && element.evalColl <=4){ this.selectedDevice=element.evalColl;  }
  
   this.evalColl=element.evalColl;
    this.jusification= element.justification;
    this.enableEdit = true;
    this.enableEditIndex = i;
    console.log(i, e);
  }

  saveSegment(element){
    if(!this.selectedDevice || this.selectedDevice=="" ){
      this.errsaisi=true;
      }else{
        this.errsaisi=false;
      element.evalColl= this.selectedDevice ;
      element.justification=this.jusification;
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

  onChange(e){
    
    this.selectedDevice=e;
  }


}
