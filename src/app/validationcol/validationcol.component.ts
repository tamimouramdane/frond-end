import { Component, OnInit, ViewChild } from '@angular/core';
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
  selector: 'app-validationcol',
  templateUrl: './validationcol.component.html',
  styleUrls: ['./validationcol.component.scss']
})
export class ValidationcolComponent implements OnInit {
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
  responsable: Employe;
  selectedDevice: any;
  visa;  eval:boolean;
  datevalid :Date;
   commencol;
  selectedDev;
  amel; fort;
  commenresp;
  datevalidcol :Date;
  valExistante:Validation;
  val;
  typeval: number;
  validation: Validation;
  etape: number;
  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder ,
    private employeService:EmployeService, private evaluationService:EvaluationService,
    private tokenStorageService:TokenStorageService,
    private router:Router,private objectifService:ObjectifService ,private dialog: MatDialog
    ,private phaseService:PhaseService,private validationService : ValidationService) {
  }

  ngOnInit(): void {
   
    this.id= this.tokenStorageService.getUser().id;
    this.employeService.getEmployeUser(Number(this.id)).subscribe(emp => {
    this.resp=emp.superieur.nom.toUpperCase() +' '+emp.superieur.prenom;  
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
      if(val){
        this.datevalid= val.dateResp;
          this.commenresp= val.commentaireResp;
          this.fort= val.pointFrot;
          this.amel = val.pointAm;
        if(val.valCol){
        this.datevalidcol= val.dateCol;  
        this.commencol=val.commentaireCol;
        this.val=true;
        }
       }
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
 
 this.phaseService.getPhase().subscribe(phase => { this.etape= phase.etape;
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
    this.val=false; 
  
      if( this.valExistante){
      this.valExistante.dateCol=this.datevalidcol;
      this.valExistante.valCol = true;
      this.valExistante.commentaireCol =this.commencol; console.log(this.valExistante);
      this.validationService.updateValidation(this.valExistante).subscribe(rsl=>{
        this.ngOnInit();
      },
      err=>{
        console.log(err.error.message); 
      });
      }
      else{
        if(this.etape == 6){
            this.typeval=0; 
        }else{
          this.typeval=1;
        }

        this.validation= new Validation(this.collab,this.typeval,this.datevalidcol, null
          , null, this.commencol,null, true,null
          , this.date  );  console.log(this.validation);
          this.validationService.createValidation(this.validation).subscribe(rsl=>{
            this.ngOnInit();
          },
          err=>{
            console.log(err.error.message); 
          });
      }
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

    
}

}
