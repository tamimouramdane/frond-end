import { Component, OnInit,OnDestroy ,ViewChild,TemplateRef} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeService } from '../services/Employe.service';
import { PosteService } from '../services/Poste.service';
import { Poste } from '../models/Poste.model';
import { Subscription } from 'rxjs';
import { Employe } from '../models/Employe.model';
import { AuthService } from '../services/auth.service';
import {User }from '../models/User.model';
import { MatTableDataSource } from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatFormFieldControl} from '@angular/material/form-field'
import { MatPaginator} from '@angular/material/paginator';
import { ValidationService } from '../services/Validation.service';
import { PhaseService } from '../services/phase.service';

@Component({
  selector: 'app-employe-list',
  templateUrl: './employe-list.component.html',
  styleUrls: ['./employe-list.component.scss']
})
export class EmployeListComponent implements OnInit {

  add:boolean;
  employeForm: FormGroup;
  postes:Array<Poste>=new Array<Poste>();
  posteSubscription: Subscription;
  employes:Array<Employe>=new Array<Employe>();
  employeSubscription: Subscription;
  userregister:User;
  newemplye:Employe;
  responsable:Employe;
  posteoccupe:Poste;
  errorMessage = '';
   loading = false;
   submitted = false;
   displayedColumns: string[] = ['Numemploye', 'nom', 'prenom','posteoccupe','responsable','action1','action2'];
   @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
   @ViewChild(MatSort, {static: true}) sort: MatSort;
   dataSource ;
   enableEdit=false;
   enableEditIndex;
   nom; prenom; poste; resp;
   selectedposte; selectedresp; 
   usernameexiste;  emailexiste;
   @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  etape: number;
  constructor(private formBuilder: FormBuilder,
            private employeService: EmployeService, private router: Router,
              private posteService:PosteService, private authService: AuthService
              ,private dialog: MatDialog, private validationService: ValidationService, private phaseService :PhaseService
             ) { }

   callAPI(element) {
     let dialogRef = this.dialog.open(this.callAPIDialog);
     dialogRef.afterClosed().subscribe(result => {
         // Note: If the user clicks outside the dialog or presses the escape key, there'll be no result
         if (result !== undefined) {
             if (result === 'yes') {
                 this.employeService.deleteEmploye(element.codeEmploye).subscribe(resultat=>{
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
    
    this.employeService.getAllEmployes().subscribe(employes => {
      this.dataSource  = new MatTableDataSource<Employe>(employes);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.employes=employes;
    });
     
    this.posteService.getAllPostes().subscribe(postes => {
      this.postes = postes;  
    });
 
   this.phaseService.getPhase().subscribe(phase=>{
      this.etape=phase.etape;
      if(phase.etape >=6){
      
      }
   },
   err=>{
     
   })
    
  }
  
  ajouterEmploye(){
    if(this.postes && this.postes.length > 0){
    this.initForm();
    this.add=!this.add;  
    }else{
    
    }  
  }

  initForm() {
   

    this.employeForm = this.formBuilder.group({
      nom: ['', Validators.required],
      prenom:['',Validators.required],
      intituleposte: this.postes[0].intitulePoste ,
      responsable:'aucun',
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
  
  get f() { return this.employeForm.controls; }
  onSubmitForm() {
    this.submitted = true;
    this.usernameexiste=false;
    this.emailexiste=false;
     if (this.employeForm.invalid) {
         return;
     }
   
    const formValue = this.employeForm.value;
    var array = formValue['responsable'].split(" -- ");
    if(this.employes){this.responsable= this.employes.filter (employe => ( employe.nom == array[0] && employe.prenom == array[1]))[0] ;}
    console.log(this.postes.find (poste => poste.intitulePoste == formValue['intituleposte']).codePoste);
  
    this.posteoccupe= this.postes.find (poste => poste.intitulePoste == formValue['intituleposte']);
    this.userregister=new User(    formValue['username'],
    formValue['password'],
    formValue['email']
       );

       this.newemplye=new Employe( 
        formValue['nom'] ,
        formValue['prenom'] ,
       this.posteoccupe,
       this.responsable ,
       this.userregister
       );
       console.log(this.newemplye);
       this.employeService.createEmploye(this.newemplye).subscribe(employe =>
        {
          
        console.log(employe);
        this.add=!this.add; 
        this.ngOnInit();
      },
      err => {
       
        this.errorMessage = err.error.message;
        console.log('erreur '+this.errorMessage);
        this.loading = false;
        
        if(this.errorMessage=="Erreur -> Username et Email deja utilisé!"){
          this.employeForm.controls['username'].setErrors({usernamefaux:true});
         
          this.usernameexiste=true;
          this.emailexiste=true;
          }
        if(this.errorMessage=="Erreur -> Username deja utilisé!"){
          this.employeForm.controls['username'].setErrors({usernamefaux:true});
      
        this.usernameexiste=true;
        }

        if(this.errorMessage=="Erreur -> Email deja utilisé!"){
        this.emailexiste=true;
        }
      });
      this.submitted=false;
     /* this.add=!this.add; */
    }

    Annuler(){
      this.loading=false;
      this.submitted=false;
      this.usernameexiste=false;
      this.emailexiste=false;
      this.add=!this.add;
    }
   
    
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  enableEditMethod(e, i,element) {/*
  this.services[i]=new Service(this.codeService,this.intitulePosition,'service');*/
  this.displayedColumns.pop();
   this.nom=element.nom;
   this.prenom=element.prenom;
   this.poste=element.poste;
   if(element.poste){
    this.selectedposte=this.postes.find(poste => poste.intitulePoste == element.poste.intitulePoste).intitulePoste;  
    console.log(this.selectedresp);
  }else{
    this.selectedposte='';
  }
   if(element.superieur ){
   this.selectedresp=element.superieur.nom +' -- '+element.superieur.prenom;
   }else{
    this.selectedresp='aucun'; 
   }
 this.enableEdit = true;
    this.enableEditIndex = i;
    console.log(i, e);
  }

  saveSegment(element){
 if(this.nom=='' ||this.prenom=='' || this.selectedposte=='' ){
   

    }else{
         element.nom=this.nom;
       element.prenom=this.prenom;
       element.poste=this.poste;
      element.poste=this.postes.find(poste => poste.intitulePoste==this.selectedposte);
      if(this.selectedresp!=='aucun'){
        var array = this.selectedresp.split(" -- ");
         element.superieur=this.employes.find(emp => emp.nom==array[0] && emp.prenom == array[1]);
         
        }

        this.employeService.updateEmploye(element)
        .subscribe(emp => {
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

  onChangeposte(e){
  this.selectedposte=e;
  }
  onChangeresp(e){
  this.selectedresp=e;
  }
/*
  valEmp(employe :Employe):string{
    this.validationService.getValidation(employe.codeEmploye).subscribe(val=>{
    if(val.valCol && val.valResp){console.log("valide"); return "Validé";  }
    else{console.log("non valide"); return "En cours de validation"; } 
    },
    err => {
      this.errorMessage = err.error.message;
      console.log('erreur  '+ this.errorMessage);
      return "En cours de validation";
    });
    return "En cours de validation";
  }
  */
}