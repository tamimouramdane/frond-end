import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeService } from '../services/Employe.service';
import { PosteService } from '../services/Poste.service';
import { Poste } from '../models/Poste.model';
import { Subscription } from 'rxjs';
import { Employe } from '../models/Employe.model';
@Component({
  selector: 'app-mod-employe',
  templateUrl: './mod-employe.component.html',
  styleUrls: ['./mod-employe.component.scss']
})
export class ModEmployeComponent implements OnInit {

 
  employeForm: FormGroup;
  postes: Poste[];
  posteSubscription: Subscription;
  employes: Employe[];
  employeSubscription: Subscription;
  employemod:Employe;
 /* divisionexistante:boolean=false; */
  constructor(private formBuilder: FormBuilder,
            private employeService: EmployeService, 
              private router: Router,
              private posteService:PosteService,
              private route: ActivatedRoute
             ) { }

  ngOnInit() {
 
   

   

    this.employeForm = this.formBuilder.group({
      nom: [ this.route.snapshot.params['CodeEmploye'] ] ,
      prenom:['aaaa'],
      intituleposte: this.employemod.poste.intitulePoste,
      responsable:'aucun'
      /*
      email:this.employemod.Email,
      password: this.employemod.Password
      */
    });
    
  }
  
  onSubmitForm() {
    
    const formValue = this.employeForm.value;
/*
    if(this.divisionService.existeDivision(formValue['intituledivision'] )){
      this.divisionexistante=true;
    }
    else {
    DivisionService.id++;
    const newDivision = new Division('division'+DivisionService.id,'division',formValue['intituledivision']);
    this.divisionService.addDivision(newDivision);
    this.divisionService.emitDivisions();
    
    this.router.navigate(['/divisions']);
    }
*/
    this.router.navigate(['/employes']);
  }

}
