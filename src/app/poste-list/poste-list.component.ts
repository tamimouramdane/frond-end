import { Component, OnInit,OnDestroy ,ViewChild,TemplateRef} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Division } from '../models/Division.model';
import { DivisionService } from '../services/Division.service';
import { FilialeService } from '../services/Filiale.service';
import { DirectionService } from '../services/Direction.service';
import { Filiale } from '../models/Filiale.model';
import { Direction } from '../models/Direction.model';
import { Service } from '../models/Service.model';
import { ServiceService } from '../services/Service.service';
import { PosteService } from '../services/Poste.service';
import { Position } from '../models/Position.model';
import {Poste} from'../models/Poste.model';
import { MatTableDataSource } from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import { MatPaginator} from '@angular/material/paginator';

@Component({
  selector: 'app-poste-list',
  templateUrl: './poste-list.component.html',
  styleUrls: ['./poste-list.component.scss']
})
export class PosteListComponent implements OnInit {
  add:boolean;
  posteForm:FormGroup;
  divisions: Division[];
  filiales: Filiale[];
  directions: Direction[];
  services: Service[];
  postes: Array<Poste>=new Array<Poste>();
  posteexistante:boolean=false;
  niv:number=1;
  newposte:Poste;
  typevide:boolean;
  division:Division;
  filiale:Filiale;
  direction:Direction;
  service:Service;
  displayedColumns: string[] = ['NumPoste', 'intitulePoste', 'categoriePoste','position','action1','action2'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  dataSource ;
  fils:Filiale[]=[];
  errorMessage = '';
  loading = false;
  submitted = false;
  selectedDiv; selectedFil; selectedDir; selectedSer;
  enableEdit=false;
  enableEditIndex;
  intituleposte; categorieposte; position; selectedDevice;
  
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  constructor(private formBuilder: FormBuilder,private divisionService: DivisionService, 
    private router:Router,private filialeService: FilialeService,
    private directionService :DirectionService,private serviceService: ServiceService,
    private posteService : PosteService ,private dialog: MatDialog ){ }

 callAPI(element) {
        let dialogRef = this.dialog.open(this.callAPIDialog);
        dialogRef.afterClosed().subscribe(result => {
            // Note: If the user clicks outside the dialog or presses the escape key, there'll be no result
            if (result !== undefined) {
                if (result === 'yes') {
                    this.posteService.deletePoste(element.codePoste).subscribe(resultat=>{
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
    this.posteService.getAllPostes().subscribe(postes => {
      this.dataSource  = new MatTableDataSource<Poste>(postes);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.postes=postes;
    },
    err=>{
     console.log(err.error.message);
      
    } );
    
    this.divisionService.getAllDivisions().subscribe(divisions => {
      this.divisions = divisions; },
    err=>{  console.log(err.error.message);          } );

    this.filialeService.getAllFiliales().subscribe(filiales => {
      this.filiales = filiales;
    },
    err=>{  console.log(err.error.message);          } );

    this.directionService.getAllDirections().subscribe(directions => {
      this.directions = directions;
    },
    err=>{  console.log(err.error.message);          } );

    this.serviceService.getAllServices().subscribe(services => {
      this.services = services;
    },
    err=>{  console.log(err.error.message);          } );
   
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  initForm(){
    this.selectedDiv='aucune'; this.selectedFil='aucune';
    this.selectedDir='aucune';  this.selectedSer='aucun';

    this.posteForm = this.formBuilder.group({
      intituleposte: ['' ,Validators.required],
      categorieposte: [ '',Validators.required],
      division: 'aucune',
      filiale: 'aucune',
      direction: 'aucune',
      service: 'aucune'
  
    });
  }

  ajouterPoste(){
    this.initForm();
    this.add=!this.add; 
  }

  get f() { return this.posteForm.controls; }
  onSubmitForm() {
    this.submitted = true;
    this.typevide=false;
     if (this.posteForm.invalid) {
         return;
     }
      
    const formValue = this.posteForm.value;
    
    if(formValue['service'] != 'aucune'  ){
      console.log('test service');
     this.service = this.services.filter (service => service.intitulePosition == formValue['service'])[0];
    this.service.type = 'service';
    this.newposte= new Poste(formValue['intituleposte'],formValue['categorieposte'],
    this.service);
    
    }
    else{
      if(formValue['direction'] != 'aucune'){
        this.direction = this.directions.filter (direction => direction.intitulePosition == formValue['direction'])[0];
        this.direction.type = 'direction';
        this.newposte= new Poste(formValue['intituleposte'],formValue['categorieposte'],
        this.direction);
      }
   
      else{
        if(formValue['filiale'] != 'aucune'){
          this.filiale=this.filiales.filter (filiale => filiale.intitulePosition == formValue['filiale'])[0] ;
          this.filiale.type='filiale';
          this.newposte= new Poste(formValue['intituleposte'],formValue['categorieposte'],
          this.filiale);
          console.log("test filiale");
          }
         else{
          if(formValue['division'] != 'aucune'){
         this.division= this.divisions.filter (division => division.intitulePosition == formValue['division'])[0] ;
         this.division.type='division';
          this.newposte = new Poste(formValue['intituleposte'],formValue['categorieposte'],
          this.division);
          }
          else{
            this.typevide=true;
            return;
          }
         } 
         }
    }
   
    console.log('posteservic' +  this.newposte.intitulePoste);
    this.posteService.createPoste(this.newposte).subscribe(poste => {
       this.ngOnInit();
       this.submitted=false;
      },
      err => {
       
        this.errorMessage = err.error.message;
        this.loading = false;
        console.log( err.error.message);
      });
   
  }
 
    Annuler(){
      this.loading=false;
      this.submitted=false;
      this.add=!this.add;
    }

    onChangeDiv(div){
      this.selectedDiv=div;
     
      this.filiale=this.filiales.find(fil=> fil.intitulePosition == this.selectedFil );
      if(div == 'aucune' && this.filiale && this.filiale.division){
        this.selectedFil='aucune';
      }
      else{
      this.division=this.divisions.find(division => division.intitulePosition== div );

      if(this.division && this.selectedFil !='aucune'){
        
        if(this.filiale && ( !this.filiale.division || this.filiale.division.intitulePosition !== div )){
         this.selectedFil='aucune';
        }
      }
     }
    }

    onChangeFil(e){
      this.selectedFil=e;
      this.direction=this.directions.find(dir=> dir.intitulePosition == this.selectedDir );
      console.log('sel '+e);
      if(e=='aucune'){
     
      if(this.direction && this.direction.filiale){
      this.selectedDir='aucune'
      }
      }
      else{
        if(this.direction && this.direction.filiale && this.direction.filiale.intitulePosition !== e){
          this.selectedDir='aucune';
          console.log('aucune  dir '+this.selectedDiv);
        }
      this.filiale=this.filiales.find(fil=> fil.intitulePosition == e );
      if(this.filiale ){
        if(this.filiale.division && this.selectedDiv !== this.filiale.division.intitulePosition){
    
      this.selectedDiv=this.filiale.division.intitulePosition; 
      this.onChangeDiv(this.selectedDiv);
        
      }
      else{
      
        this.selectedDiv='aucune';
        console.log('aucune   '+this.selectedDiv);
      }
      }
    }
    }

    onChangeDir(e){
      this.selectedDir=e;
      this.service=this.services.find(ser=> ser.intitulePosition == this.selectedSer );
      console.log('sel '+e);
      if(e=='aucune'){
     
      if(this.service && this.service.direction){
      this.selectedSer='aucune'
      }
      }
      else{
        if(this.service && this.service.direction && this.service.direction.intitulePosition !== e){
          this.selectedSer='aucune';
          console.log('aucune  ser '+this.selectedFil);
        }
      this.direction=this.directions.find(dir=> dir.intitulePosition == e );
      if(this.direction ){
        if(this.direction.filiale && this.selectedFil !== this.direction.filiale.intitulePosition){
    
      this.selectedFil=this.direction.filiale.intitulePosition;
        
      }
      else{
      
        this.selectedFil='aucune';
        console.log('aucune   '+this.selectedFil);
      }
      }
    }


    }
  

    
  enableEditMethod(e, i,element) {/*
    this.services[i]=new Service(this.codeService,this.intitulePosition,'service');*/
    this.displayedColumns.pop();
     this.intituleposte=element.intitulePoste;
     this.categorieposte=element.categoriePoste;
    this.selectedDevice=element.position.intitulePosition;

   this.enableEdit = true;
      this.enableEditIndex = i;
      console.log(i, e);
    }
  
    saveSegment(element){
   if(this.intituleposte=='' ||this.categorieposte=='' ){
 
     }
     else{
       switch (element.position.type){
         case'division': { this.position=this.divisions.find(div => div.intitulePosition==this.selectedDevice );   break;  }
         case'filiale': { this.position=this.filiales.find(filiale => filiale.intitulePosition==this.selectedDevice );   break;  }
         case'direction': { this.position=this.directions.find(direction => direction.intitulePosition==this.selectedDevice );   break;  }
         case'service': { this.position=this.services.find(service => service.intitulePosition==this.selectedDevice );   break;  }
       }
       console.log('aaaaaaaaaaa '+this.position.intitulePosition);
       this.posteService.updatePoste(new Poste(this.intituleposte,this.categorieposte,this.position,element.codePoste  )).subscribe(poste => {
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

    onChange(e){
      this.selectedDevice=e;
    }

    delete(e,i){

    }
}