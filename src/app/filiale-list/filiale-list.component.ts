import { Component, OnInit,OnDestroy ,ViewChild,TemplateRef} from '@angular/core';
 import { Filiale } from '../models/Filiale.model';
 import { Subscription, from } from 'rxjs';
 import { FilialeService } from '../services/Filiale.service';
 import { Router } from '@angular/router';

 import { FormBuilder, FormGroup, Validators } from '@angular/forms';
 
 import { MatTableDataSource } from '@angular/material/table';
 import {MatSort} from '@angular/material/sort';
 import {MatFormFieldControl} from '@angular/material/form-field'
 import {MatPaginatorModule, MatPaginator} from '@angular/material/paginator';
import { Division } from '../models/Division.model';
import { DivisionService } from '../services/Division.service';
import {MatDialog} from '@angular/material/dialog';
 @Component({
   selector: 'app-filiale-list',
   templateUrl: './filiale-list.component.html',
   styleUrls: ['./filiale-list.component.scss']
 })
 export class FilialeListComponent implements OnInit {
 
   filiales;
   add:boolean;
   filialeForm: FormGroup;
   newfiliale:Filiale;
   errorMessage = '';
   loading = false;
   submitted = false;
   displayedColumns: string[] = ['NumFiliale', 'codeFiliale', 'intituleFiliale','divisionMere','action1','action2'];
   @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
   @ViewChild(MatSort, {static: true}) sort: MatSort;
   dataSource ;
   enableEdit=false;
   enableEditIndex;
   codeFiliale; 
   intitulePosition;
   updateerror=false;
   divisionmere:Division;
   divmere:Division;
   divisions:Array<Division>=new Array<Division>();
   selectedDevice: any;
   codeexiste;  intituleexiste;
   @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
   constructor(private filialeService: FilialeService,private formBuilder: FormBuilder,private divisionService:DivisionService
    ,private dialog: MatDialog) { }
 
   

  callAPI(element) {
    let dialogRef = this.dialog.open(this.callAPIDialog);
    dialogRef.afterClosed().subscribe(result => {
        // Note: If the user clicks outside the dialog or presses the escape key, there'll be no result
        if (result !== undefined) {
            if (result === 'yes') {
                this.filialeService.deleteFiliale (element.codePosition).subscribe(resultat=>{
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
     this.filialeService.getAllFiliales().subscribe(filiales => {
       this.dataSource  = new MatTableDataSource<Filiale>(filiales);
       this.dataSource.paginator = this.paginator;
       this.dataSource.sort = this.sort;
       this.filiales=filiales;
   });
   this.divisionService.getAllDivisions().subscribe(divisions => {
    this.divisions = divisions;
    
});
   }
   
  
   initForm() {
    this.filialeForm = this.formBuilder.group({
      codefiliale:['',Validators.required],
      intitulefiliale: ['',Validators.required ],
      intitulemere:  'aucune'
    });
  }
  get f() { return this.filialeForm.controls; }
  onSubmitForm() {
    this.submitted = true;
    this.codeexiste=false;
    this.intituleexiste=false;

     // stop here if form is invalid
     if (this.filialeForm.invalid) {
         return;
     }
   
     const formValue = this.filialeForm.value;
     this.divisionmere= this.divisions.filter (division => division.intitulePosition == formValue['intitulemere'])[0] ;
     if(this.divisionmere){  this.divisionmere.type='division'; }

     this.newfiliale=new Filiale(formValue['codefiliale'],formValue['intitulefiliale'],
        this.divisionmere );
    this.loading = true;
     this.filialeService.createFiliale(this.newfiliale).subscribe( filiale => {
        this.ngOnInit(); 
        this.add=false;  
      },
      err => {
       
        this.errorMessage = err.error.message;
        this.loading = false;
        if(this.errorMessage=="Fail -> Code Filiale Name Already Exists!"){
         this.codeexiste=true;
         }
 
         if(this.errorMessage=="Fail -> Filiale Name Already Exists!"){
         this.intituleexiste=true;
         }
      });
      this.submitted=false;  
  }
 
   ajouterFiliale(){
     this.initForm();
     this.add=!this.add;    
   }
 
   onSupprimerFiliale(filiale:Filiale){
  
   }
 
   onModifierFiliale(filiale:Filiale){
 
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
   this.filiales[i]=new Filiale(this.codeFiliale,this.intitulePosition,'filiale');*/
   this.displayedColumns.pop();
    this.codeFiliale=element.codeFiliale;
    this.intitulePosition=element.intitulePosition;
    if(element.division){
    this.divmere= this.divisions.filter (division => division.intitulePosition == element.division.intitulePosition)[0] ;
   
    if(this.divmere){ this.selectedDevice=this.divmere.intitulePosition; }
    }
    else{ this.selectedDevice='aucune';}

     this.enableEdit = true;
     this.enableEditIndex = i;
     console.log(i, e);
   }
 
   saveSegment(element){
   
    
     if(this.codeFiliale=='' ||this.intitulePosition=='' ){
     
     }else{
      
       this.divmere= this.divisions.filter (division => division.intitulePosition == this.selectedDevice)[0] ;
     
      console.log(new Filiale(this.codeFiliale,this.intitulePosition,this.divmere ,
        'filiale',element.codePosition));
     this.filialeService.updateFiliale(new Filiale(this.codeFiliale,this.intitulePosition,this.divmere ,
      'filiale',element.codePosition)).subscribe(filiale => {
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
   delete(e,codeFiliale){
     console.log('codeFiliale   '+codeFiliale);
   }

   onChange(e){
     
     this.selectedDevice=e;
   }
 }