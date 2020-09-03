import { Component, OnInit,OnDestroy ,ViewChild,TemplateRef} from '@angular/core';

import { Division } from '../models/Division.model';
import { Subscription, from } from 'rxjs';
import { DivisionService } from '../services/Division.service';
import { Router } from '@angular/router';
import { FilialeService } from '../services/Filiale.service';
import { DirectionService } from '../services/Direction.service';
import {AccordionModule} from 'primeng/accordion';     //accordion and accordion tab
import {MenuItem} from 'primeng/api';                  //api
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatTableDataSource } from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatFormFieldControl} from '@angular/material/form-field'
import {MatPaginatorModule, MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
@Component({
  selector: 'app-division-list',
  templateUrl: './division-list.component.html',
  styleUrls: ['./division-list.component.scss']
})
export class DivisionListComponent implements OnInit {

  divisions;
  add:boolean;
  divisionForm: FormGroup;
  newdivision:Division;
  errorMessage = '';
  loading = false;
  submitted = false;
  displayedColumns: string[] = ['NumDivision', 'codeDivision', 'intitulePosition','action1','action2'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  dataSource ;
  enableEdit=false;
  enableEditIndex;
  codeDivision; 
  intitulePosition;
  updateerror=false;
  codeexiste;  intituleexiste;
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;

  constructor(private divisionService: DivisionService,private formBuilder: FormBuilder,private dialog: MatDialog) { }

  callAPI(element) {
    let dialogRef = this.dialog.open(this.callAPIDialog);
    dialogRef.afterClosed().subscribe(result => {
        // Note: If the user clicks outside the dialog or presses the escape key, there'll be no result
        if (result !== undefined) {
            if (result === 'yes') {
                this.divisionService.deleteDivision(element.codePosition).subscribe(resultat=>{
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
  ngOnInit() {
    this.add=false;
    this.divisionService.getAllDivisions().subscribe(divisions => {
      this.dataSource  = new MatTableDataSource<Division>(divisions);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.divisions=divisions;
  });
  
  }
  
  initForm() {
    this.divisionForm = this.formBuilder.group({
      codedivision:['',Validators.required],
      intituledivision: ['',Validators.required ]
    });
  }
  get f() { return this.divisionForm.controls; }
  onSubmitForm() {
    this.submitted = true;
    this.codeexiste=false;
    this.intituleexiste=false;
     // stop here if form is invalid
     if (this.divisionForm.invalid) {
         return;
     }
   
    const formValue = this.divisionForm.value;
    this.newdivision=new Division(formValue['codedivision'],formValue['intituledivision'],'division');
    console.log(this.newdivision);
    this.loading = true;
     this.divisionService.createDivision(this.newdivision).subscribe( division => {
        this.ngOnInit(); 
        this.add=false;  
     },
     err => {
      
       this.errorMessage = err.error.message;
       this.loading = false;
       if(this.errorMessage=="Fail -> Code Division Already Exists!"){
        this.codeexiste=true;
        }

        if(this.errorMessage=="Fail -> Division Name Already Exists!"){
        this.intituleexiste=true;
        }
     });
     this.submitted=false;
    
  }

  ajouterDivision(){
    this.initForm();
    this.add=!this.add;    
  }

  onSupprimerDivision(division:Division){
 
  }

  onModifierDivision(division:Division){

  }
  Annuler(){
    this.codeexiste=false;
    this.intituleexiste=false;
    this.loading=false;
    this.submitted=false;
    this.add=false;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  enableEditMethod(e, i,element) {/*
  this.divisions[i]=new Division(this.codeDivision,this.intitulePosition,'division');*/
  this.displayedColumns.pop();
   this.codeDivision=element.codeDivision;
   this.intitulePosition=element.intitulePosition;
  
    this.enableEdit = true;
    this.enableEditIndex = i;
    console.log(i, e);
  }

  saveSegment(element){
  
   
    if(this.codeDivision=='' ||this.intitulePosition=='' ){
    
    }else{
    this.divisionService.updateDivision(new Division(this.codeDivision,this.intitulePosition,'division',element.codePosition)).subscribe(division => {
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
  cancel(i){
    this.displayedColumns.push('action2');
    this.enableEdit = false;
    this.enableEditIndex = null;
  }
  delete(e,codeDivision){
    console.log('codeDivision   '+codeDivision);
  }
}