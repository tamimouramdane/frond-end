import { Component, OnInit } from '@angular/core';
import { AuthenticationService }  from '../services/authentication.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { TokenStorageService } from '../services/token-storage.service';
import { PhaseService } from '../services/phase.service';
import { isNumber } from '@ng-bootstrap/ng-bootstrap/util/util';
import { Phase } from '../models/Phase.model';
import { Location } from '@angular/common';
@Component({
  selector: 'app-adminsdashboard',
  templateUrl: './adminsdashboard.component.html',
  styleUrls: ['./adminsdashboard.component.scss']
})
export class AdminsdashboardComponent implements OnInit {
content = '';
private roles: string[];
isLoggedIn = false;
showAdminBoard = false;
showModeratorBoard = false;
username: string;
date;
obcol;
datefixee;
changedate:boolean; 
selectedDev;
etape:number;
errdate:boolean=false;
  constructor(private userService: UserService,private router:Router,
    private tokenStorageService: TokenStorageService,private phaseService:PhaseService,
    public _location: Location) { }

    refresh(): void {
      this.router.navigateByUrl("", { skipLocationChange: true }).then(() => {
        console.log(decodeURI(this._location.path()));
        this.router.navigate([decodeURI(this._location.path())]);
      });
    }

  ngOnInit() {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    console.log(this.tokenStorageService.getUser());
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');

      this.username = user.username; 
    }
   this.phaseService.getPhase().subscribe(phase => {
    if(phase.date < 0 || !phase.date){
      this.date=  new Date().getFullYear();
      this.datefixee=new Date().getFullYear() - 1; 
    }
    else{
      this.date= phase.date;
      this.datefixee=phase.date; 
    }
    
    if(phase.etape>=1 && phase.etape <=8){
      this.selectedDev=phase.etape; }
      else{ this.selectedDev=1;        }
   },
   err =>{
      console.log(err.error.message);
    /*  this.date=  new Date().getFullYear();
      this.datefixee=this.date;*/
   });
   
  }
  /*
  Commencer(){
    this.errdate=false;
    console.log("aa"+this.datefixee);
    if(this.date ==''  || this.date <=this.datefixee){
      this.errdate=true;
    }
    else{
      this.phaseService.setPhase(new Phase( this.date,1)).subscribe(d => {
        console.log(new Phase( this.date,1));
      } ,
        err => {console.log(err.error.message); }); 
    }
  }*/
  onChangeDev(e){
    console.log("date"+this.datefixee);
    if(e==1){
      this.date=this.date+1;
    
    }
   
    this.phaseService.setPhase(new Phase( this.date,e)).subscribe(etape => {
      console.log(new Phase( this.date,e));
      this.refresh();
     },
      err =>{   console.log(err.error.message);    });
      this.selectedDev=e;

     
  }

  logout() {
    this.tokenStorageService.signOut();
    this.router.navigate(['/auth']);
  }
 

}
