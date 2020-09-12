import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { EmployeService } from '../services/Employe.service';
import { EvaluationService } from '../services/Evaluation.service';
import { TokenStorageService } from '../services/token-storage.service';
import { ObjectifService } from '../services/Objectif.service';
import { MatDialog } from '@angular/material/dialog';
import { PhaseService } from '../services/phase.service';
import { Ponderation } from '../models/Ponderation.model';
import { Employe } from '../models/Employe.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EvaluationIndividuelle } from '../models/EvaluationIndividuelle.model';
import { Evaluation } from '../models/Evaluation.model';
import { ValidationService } from '../services/Validation.service';
import { Validation } from '../models/Validation.model';
import * as jspdf from 'jspdf';  
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-validation',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.scss']
})
export class ValidationComponent implements OnInit {
  @ViewChild('content') content: ElementRef;
  a: string;
  ponderations:Array<Ponderation>=new Array<Ponderation>();
  evaluations:Array<Evaluation>=new Array<Evaluation>();
  collab:Employe;
  displayedColumns: string[] ;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  dataSource ; dataSource2 ;
  displayedColumns2: string[] ;
  errorMessage: any;
  loading: boolean;
  date: number;
  valmidep: boolean;
  valmi: boolean;
  valfi:boolean;
  id: any;
  coll; resp;
  validation:Validation;
  responsable: Employe;
  selectedDevice: any;
  visa;  eval:boolean;
  datevalid; commencol;
  selectedDev;
  amel; fort;
  etape: any;
  commenresp;
  valExistante: Validation;
  datevalidcol;
  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder ,
    private employeService:EmployeService, private evaluationService:EvaluationService,
    private tokenStorageService:TokenStorageService,
    private router:Router,private objectifService:ObjectifService ,private dialog: MatDialog
    ,private phaseService:PhaseService, private validationService : ValidationService) {
      
    }

  ngOnInit(): void {
    this.datevalid=new Date().getDate();  new Date()
    this.id= this.tokenStorageService.getUser().id;
    this.employeService.getEmployeUser(Number(this.id)).subscribe(emp => {
    this.resp=emp.nom.toUpperCase() +' '+emp.prenom;  console.log('aqaa');
    },
    err =>{
      console.log(err.error.message);  
     });

    this.a =String( this.route.parent.snapshot.params['id'] ).substring(1,String( this.route.parent.snapshot.params['id'] ).length) ; 
    this.employeService.getEmployeUser(Number(this.a)).subscribe(emp => {
    this.coll=emp.nom.toUpperCase() +' '+emp.prenom;  this.collab=emp;
    this.evaluationService.getAllPonderations( this.collab.codeEmploye).subscribe(ponds=>{
      this.dataSource2  = new MatTableDataSource<Ponderation>(ponds);
     this.ponderations=ponds;  
    },
    err =>{
     console.log(err.error.message);  
    });
 
    this.evaluationService.getAllEvaluation(String(this.collab.codeEmploye)).subscribe(evas => {
     this.dataSource  = new MatTableDataSource<EvaluationIndividuelle>(evas);
     this.dataSource.paginator = this.paginator;
     this.dataSource.sort = this.sort;
       this.evaluations=evas;   
     });

     this.validationService.getValidation(emp.codeEmploye).subscribe(val=>{
     this.valExistante=val;
     if(val){ }
     },
     err=>{
      console.log(err.error.message);  
     });
 },
 err => { 
   this.errorMessage = err.error.message;
  this.loading = false;
  console.log( this.errorMessage);
 }) ;
 
 this.phaseService.getPhase().subscribe(phase => { this.etape=phase.etape;
  if(phase.date>0){
    this.date=phase.date;
  }
  if(phase.etape >=6 && phase.etape <=10){
   
    this.valmidep=true;
    if(phase.etape<= 7){
      this.displayedColumns2  = ['typeobjectif','intituledivfil','objectif','ponderation'];
      this.displayedColumns = ['Numobjectif', 'intituleObjectif', 'ponderation','evalMiParCollab','evalMiParcours'];
    
    }else{
      this.displayedColumns2  = ['typeobjectif','intituledivfil','objectif','ponderation','evalFinale'];
      this.displayedColumns = ['Numobjectif', 'intituleObjectif', 'ponderation','evalFinCollab','evalFinale'];
    }
  if(phase.etape== 6){
    this.valmi=true;
   }
        else{
      
          this.valmi=false;
        }
   if(phase.etape>=8){
   if(phase.etape==8){
    this.valfi=true;
   } else{
       this.valfi=false;
   }    
  }
      }
 },
 err =>{
    console.log(err.error.message);
 });
  }

  onChange(e){
    this.selectedDevice=e;
  }
  
  Annuler(){
    this.eval=false;
  }

  Valider(){
    this.eval=true; console.log(this.eval);
  /*
    if(this.etape == 6){
      this.validation= new Validation(this.coll, this.datevalid,0 ,true ,null ,null,null,
        null, this.date, this.fort, this.amel );
    }

    if(this.etape == 8){
      this.validation= new Validation(this.coll, this.datevalid,0 ,true ,null ,null,null,
        null, this.date, this.fort, this.amel );
    }
  */
  }
  
  onChangeDev(e){

  }

  downloadPDF(){

    var data = document.getElementById('content');
    html2canvas(data).then(canvas => {
      var imgWidth = 208;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jspdf.jsPDF();
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save('Validation.pdf');
    });

    /*
  let doc = new jsPDF; 

  let specialElementHandlers ={
    '#editor': function( element,renderer){
    return true;
  }

  };
  let cont = this.content.nativeElement;
  doc.fromHTML(cont.innerHTML, 15 , 15 , {
    'width' : 190,
    'elementHandlers' : specialElementHandlers
  });
  doc.save('Validation.pdf');
*/
}

}