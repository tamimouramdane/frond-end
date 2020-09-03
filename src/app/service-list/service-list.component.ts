import { Component, OnInit,OnDestroy ,ViewChild,TemplateRef} from '@angular/core';
import { Service } from '../models/Service.model';
import { Subscription, from } from 'rxjs';
import { ServiceService } from '../services/Service.service';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatTableDataSource } from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatFormFieldControl} from '@angular/material/form-field'
import {MatPaginatorModule, MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import { Direction } from '../models/Direction.model';
import { DirectionService } from '../services/Direction.service';
@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss']
})
export class ServiceListComponent implements OnInit {

  services;
  add:boolean;
  serviceForm: FormGroup;
  newservice:Service;
  errorMessage = '';
  loading = false;
  submitted = false;
  displayedColumns: string[] = ['NumService', 'codeService', 'intituleService','directionMere','action1','action2'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  dataSource ;
  enableEdit=false;
  enableEditIndex;
  codeService; 
  intitulePosition;
  updateerror=false;
  directionmere:Direction;
  divmere:Direction;
  directions:Array<Direction>=new Array<Direction>();
  selectedDevice: any;
  codeexiste;  intituleexiste;
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  constructor(private serviceService: ServiceService,private formBuilder: FormBuilder,private directionService:DirectionService
    ,private dialog: MatDialog) { }

  callAPI(element) {
    let dialogRef = this.dialog.open(this.callAPIDialog);
    dialogRef.afterClosed().subscribe(result => {
        // Note: If the user clicks outside the dialog or presses the escape key, there'll be no result
        if (result !== undefined) {
            if (result === 'yes') {
                this.serviceService.deleteService (element.codePosition).subscribe(resultat=>{
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
    this.serviceService.getAllServices().subscribe(services => {
      this.dataSource  = new MatTableDataSource<Service>(services);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.services=services;
  });
  this.directionService.getAllDirections().subscribe(directions => {
   this.directions = directions;
   
});
  }
  
 
  initForm() {
   this.serviceForm = this.formBuilder.group({
     codeservice:['',Validators.required],
     intituleservice: ['',Validators.required ],
     intitulemere:  ''
   });
 }
 get f() { return this.serviceForm.controls; }
 onSubmitForm() {
   this.submitted = true;
   this.codeexiste=false;
   this.intituleexiste=false;

    // stop here if form is invalid
    if (this.serviceForm.invalid) {
        return;
    }
  
    const formValue = this.serviceForm.value;
    this.directionmere= this.directions.filter (direction => direction.intitulePosition == formValue['intitulemere'])[0] ;
    if(this.directionmere){  this.directionmere.type='direction'; }

    this.newservice=new Service(formValue['codeservice'],formValue['intituleservice'],
       this.directionmere );
   this.loading = true;
    this.serviceService.createService(this.newservice).subscribe( service => {
       this.ngOnInit(); 
       this.add=false;  
      },
      err => {
         this.errorMessage = err.error.message;
        this.loading = false;
        if(this.errorMessage=="Fail -> Code Service Already Exists!"){
         this.codeexiste=true;
         }
 
         if(this.errorMessage=="Fail -> Service Name Already Exists!"){
         this.intituleexiste=true;
         }
      });
      this.submitted=false;    
 }

  ajouterService(){
    this.initForm();
    this.add=!this.add;    
  }

  onSupprimerService(service:Service){
 
  }

  onModifierService(service:Service){

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
  this.services[i]=new Service(this.codeService,this.intitulePosition,'service');*/
  this.displayedColumns.pop();
   this.codeService=element.codeService;
   this.intitulePosition=element.intitulePosition;
   if(element.direction){
   this.divmere= this.directions.filter (direction => direction.intitulePosition == element.direction.intitulePosition)[0] ;
  
   if(this.divmere){ this.selectedDevice=this.divmere.intitulePosition; }
   }
 this.enableEdit = true;
    this.enableEditIndex = i;
    console.log(i, e);
  }

  saveSegment(element){
 if(this.codeService=='' ||this.intitulePosition=='' ){
    }else{
      this.divmere= this.directions.filter (direction => direction.intitulePosition == this.selectedDevice)[0] ;
     console.log(new Service(this.codeService,this.intitulePosition,this.divmere ,
       'service',element.codePosition));
    this.serviceService.updateService(new Service(this.codeService,this.intitulePosition,this.divmere ,
     'service',element.codePosition)).subscribe(service => {
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
  delete(e,codeService){
    console.log('codeService   '+codeService);
  }

  onChange(e){
    
    this.selectedDevice=e;
  }
}

