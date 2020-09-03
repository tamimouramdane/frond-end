import { Component, OnInit,OnDestroy ,ViewChild,TemplateRef} from '@angular/core';
import { Direction } from '../models/Direction.model';
import { Subscription, from } from 'rxjs';
import { DirectionService } from '../services/Direction.service';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatTableDataSource } from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatFormFieldControl} from '@angular/material/form-field'
import {MatPaginatorModule, MatPaginator} from '@angular/material/paginator';
import { Filiale } from '../models/Filiale.model';
import { FilialeService } from '../services/Filiale.service';
import {MatDialog} from '@angular/material/dialog';
@Component({
  selector: 'app-direction-list',
  templateUrl: './direction-list.component.html',
  styleUrls: ['./direction-list.component.scss']
})
export class DirectionListComponent implements OnInit {

  directions;
  add:boolean;
  directionForm: FormGroup;
  newdirection:Direction;
  errorMessage = '';
  loading = false;
  submitted = false;
  displayedColumns: string[] = ['NumDirection', 'codeDirection', 'intituleDirection','filialeMere','action1','action2'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  dataSource ;
  enableEdit=false;
  enableEditIndex;
  codeDirection; 
  intitulePosition;
  updateerror=false;
  filialemere:Filiale;
  divmere:Filiale;
  filiales:Array<Filiale>=new Array<Filiale>();
  selectedDevice: any;
  codeexiste;  intituleexiste;
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  constructor(private directionService: DirectionService,private formBuilder: FormBuilder,private filialeService:FilialeService
    ,private dialog: MatDialog) { }



  callAPI(element) {
    let dialogRef = this.dialog.open(this.callAPIDialog);
    dialogRef.afterClosed().subscribe(result => {
        // Note: If the user clicks outside the dialog or presses the escape key, there'll be no result
        if (result !== undefined) {
            if (result === 'yes') {
                this.directionService.deleteDirection(element.codePosition).subscribe(resultat=>{
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
    this.directionService.getAllDirections().subscribe(directions => {
      this.dataSource  = new MatTableDataSource<Direction>(directions);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.directions=directions;
  });
  this.filialeService.getAllFiliales().subscribe(filiales => {
   this.filiales = filiales;
   
});
  }
  
 
  initForm() {
   this.directionForm = this.formBuilder.group({
     codedirection:['',Validators.required],
     intituledirection: ['',Validators.required ],
     intitulemere:  'aucune'
   });
 }
 get f() { return this.directionForm.controls; }
 onSubmitForm() {
   this.submitted = true;
   this.codeexiste=false;
   this.intituleexiste=false;

    // stop here if form is invalid
    if (this.directionForm.invalid) {
        return;
    }
  
    const formValue = this.directionForm.value;
    this.filialemere= this.filiales.filter (filiale => filiale.intitulePosition == formValue['intitulemere'])[0] ;
    if(this.filialemere){  this.filialemere.type='filiale'; }

    this.newdirection=new Direction(formValue['codedirection'],formValue['intituledirection'],
       this.filialemere );
   this.loading = true;
    this.directionService.createDirection(this.newdirection).subscribe( direction => {
       this.ngOnInit(); 
       this.add=false;  
      },
      err => {
         this.errorMessage = err.error.message;
        this.loading = false;
        if(this.errorMessage=="Fail -> Code Direction Already Exists!"){
         this.codeexiste=true;
         }
 
         if(this.errorMessage=="Fail -> Direction Name Already Exists!"){
         this.intituleexiste=true;
         }
      });
      this.submitted=false;    
 }

  ajouterDirection(){
    this.initForm();
    this.add=!this.add;    
  }

  onSupprimerDirection(direction:Direction){
 
  }

  onModifierDirection(direction:Direction){

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
  this.directions[i]=new Direction(this.codeDirection,this.intitulePosition,'direction');*/
  this.displayedColumns.pop();
   this.codeDirection=element.codeDirection;
   this.intitulePosition=element.intitulePosition;
   if(element.filiale){
   this.divmere= this.filiales.filter (filiale => filiale.intitulePosition == element.filiale.intitulePosition)[0] ;
  
   if(this.divmere){ this.selectedDevice=this.divmere.intitulePosition; }
   }
   else{ this.selectedDevice='aucune';}

    this.enableEdit = true;
    this.enableEditIndex = i;
    console.log(i, e);
  }

  saveSegment(element){
  
   
    if(this.codeDirection=='' ||this.intitulePosition=='' ){
    
    }else{
     
      this.divmere= this.filiales.filter (filiale => filiale.intitulePosition == this.selectedDevice)[0] ;
    
     console.log(new Direction(this.codeDirection,this.intitulePosition,this.divmere ,
       'direction',element.codePosition));
    this.directionService.updateDirection(new Direction(this.codeDirection,this.intitulePosition,this.divmere ,
     'direction',element.codePosition)).subscribe(direction => {
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
  delete(e,codeDirection){
    console.log('codeDirection   '+codeDirection);
  }

  onChange(e){
    
    this.selectedDevice=e;
  }
}

