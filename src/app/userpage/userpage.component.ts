import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService }  from '../services/authentication.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { TokenStorageService } from '../services/token-storage.service';
import { User } from '../models/User.model';
import { EmployeService } from '../services/Employe.service';
import { Subscription } from 'rxjs';
import { PhaseService } from '../services/phase.service';

@Component({
  selector: 'app-userpage',
  templateUrl: './userpage.component.html',
  styleUrls: ['./userpage.component.scss']
})
export class UserpageComponent implements OnInit {
  name:string;
  content = '';
  private roles: string[];
isLoggedIn = false;
showAdminBoard = false;
showModeratorBoard = false;
username: string;
user:User;
id:number;
subscription: Subscription;
date; etape;
  constructor(private userService: UserService,private router:Router,
    private tokenStorageService: TokenStorageService, private employeService:EmployeService,
    private phaseService:PhaseService) { }

  ngOnInit(): void {
    /*
    this.name = this.route.snapshot.params['id']; */

    console.log(this.tokenStorageService.getUser());
      this.isLoggedIn = !!this.tokenStorageService.getToken();
  
      
      /*
        const user = this.tokenStorageService.getUser();
        this.roles = user.roles;
  
        this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
        this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');
  
        this.username = user.username; 
        */
        this.user = new User( this.tokenStorageService.getUser().username,this.tokenStorageService.getUser().password
    ,this.tokenStorageService.getUser().email,null, this.tokenStorageService.getUser().id);
    console.log('user '+this.user);

    
   this.employeService.getEmployeUser(this.user.id).subscribe(emp => {
    console.log('aa ' +emp.nom);
    this.employeService.setEmployeco(emp);
     this.employeService.sendEmploye(emp);
   
      } );  
    this.phaseService.getPhase().subscribe(phase=>{
      if(phase.date < 0 || !phase.date){
        this.date=  new Date().getFullYear();
      }
      else{
        this.date= phase.date;
      }
      
      switch(phase.etape){
        case 1: { this.etape="Initialisation"; break; }
        case 2: { this.etape="Fixation Objectifs Collectifs"; break; }
        case 3: { this.etape="Debut de la Fixation des Objectifs Individuels"; break; }
        case 4: { this.etape="Fin de la Fixation des Objectifs Individuels"; break; }
        case 5: { this.etape="Debut de l'Evaluation Mi-parcours"; break; }
        case 6: { this.etape="Fin de l'Evaluation Mi-parcours"; break; }
        case 7: { this.etape="Debut de l'Evaluation Finale"; break; }
        case 8: { this.etape="Fin de l'Evaluation Finale"; break; }
        case 9: { this.etape="Debut de l'Evolution"; break; }
        case 10: { this.etape="Fin de l'Evolution"; break; }
      }
     },
     err =>{
        console.log(err.error.message);
      /*  this.date=  new Date().getFullYear();
        this.datefixee=this.date;*/
     });
  }
    logout() {
      this.tokenStorageService.signOut();
      this.router.navigate(['/auth']);
    }
  /*
    ngOnDestroy() {
      // unsubscribe to ensure no memory leaks
      this.subscription.unsubscribe();
  }*/
  }
  
  
 


