import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeService } from '../services/Employe.service';
import { PosteService } from '../services/Poste.service';
import { Poste } from '../models/Poste.model';
import { Subscription } from 'rxjs';
import { Employe } from '../models/Employe.model';
import { AuthService } from '../services/auth.service';
import {User }from '../models/User.model';
import { TokenStorageService } from '../services/token-storage.service';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-mon-profil',
  templateUrl: './mon-profil.component.html',
  styleUrls: ['./mon-profil.component.scss']
})
export class MonProfilComponent implements OnInit {
  employeForm: FormGroup;
  postes: Poste[];
  posteSubscription: Subscription;
  employes: Employe[];
  employeSubscription: Subscription;
  userregister:User;
  newemplye:Employe;
  responsable:Employe;
  posteoccupe:Poste;
  user:User;
  id:number;
employe:Employe;
nom;prenom; poste; resp; username; email ; password;
errorMessage = '';
loading = false;
submitted = false;
objet;
subscription: Subscription;
mod:boolean=false;
 /* divisionexistante:boolean=false; */
  constructor(private formBuilder: FormBuilder,
            private employeService: EmployeService, 
              private router: Router,
              private posteService:PosteService
              , private authService: AuthService, private tokenStorageService: TokenStorageService
             ) { }

  ngOnInit() {
    this.id= this.tokenStorageService.getUser().id;
    this.employeForm = this.formBuilder.group({
      nom: ['', Validators.required],
      prenom:['',Validators.required], /*
      intituleposte:['',Validators.required],
      responsable:['',Validators.required],*/
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

 /* this.employe= this.employeService.getEmployeco();*/
 this.employeService.getEmployeUser(Number(this.id)).subscribe(emp => {
  this.employe=emp;
  this.nom=this.employe.nom; this.prenom=this.employe.prenom;
  if(this.employe.poste ){ this.poste=this.employe.poste.intitulePoste; }
  if(this.employe.superieur){
  this.resp=this.employe.superieur.nom.toUpperCase()  + '  --  '+this.employe.superieur.prenom ; }
  if(this.employe.user){
  this.username=this.employe.user.username; this.email =this.employe.user.email; this.password =this.employe.user.password;  } 
 });
  }

  get f() { return this.employeForm.controls; }
   onSubmitForm() {
     
    this.submitted = true;
    /*
    if (this.employeForm.invalid) {
      return;
  }*/
  const formValue = this.employeForm.value;
  this.employe.nom=formValue['nom'];
  this.employe.prenom=formValue['prenom'];
  this.employe.user.email=formValue['email'];
  this.employe.user.username=formValue['username'];
  console.log('eeee  '+this.employe.user.email);
  this.employeService.updateEmploye(this.employe).subscribe(resultat=>{
    this.ngOnInit(); 
  },
  err=>{
    console.log(err.error.message);
  });
   /*
     if (this.employeForm.invalid) {
         return;
     }
   
    const formValue = this.employeForm.value;
    var array = formValue['responsable'].split(" -- ");
    if(this.employes){this.responsable= this.employes.filter (employe => ( employe.nom == array[0] && employe.prenom == array[1]))[0] ;}
    if(this.postes) {this.posteoccupe= this.postes.filter (poste => poste.intitulePoste == formValue['intituleposte'])[0];}
    console.log(array[0] + array[1]);
    
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
     
      },
      err => {
       
        this.errorMessage = err.error.message;
        this.loading = false;
      });   */
      this.submitted=false;
      this.mod=false;
    /*  this.router.navigate(['userpage/:'+this.tokenStorageService.getUser().id +'/profilresponsable']);*/
    }
    
    Annuler(){
      this.loading=false;
      this.submitted=false;
      this.mod=false;
     /* this.router.navigate(['userpage/:'+this.tokenStorageService.getUser().id +'/profilresponsable']);*/
    }
    Mod(){
     this.mod=true;
   
    }
 /*
    ngOnDestroy() {
      // unsubscribe to ensure no memory leaks
      this.subscription.unsubscribe();
  }*/
}
