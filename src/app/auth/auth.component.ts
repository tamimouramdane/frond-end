import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthService }  from '../services/auth.service';
import {User } from '../models/User.model'
import { TokenStorageService } from '../services/token-storage.service';

@Component({ templateUrl: 'auth.component.html' })
export class AuthComponent implements OnInit {
  form: any = {};
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  id:number;
  a;
  userlogin:User;
  loginForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService,
    private router: Router,private formBuilder :FormBuilder) { }

  ngOnInit() {
    
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
      
       
      if(this.roles[0]=="ADMIN"){
        this.router.navigate(['/adminsdashboard']);
      }
      else{
        this.router.navigate(['/userpage/:+'+this.tokenStorage.getUser().id ]);
      }
    }
     this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {

     this.submitted = true;

     // stop here if form is invalid
     if (this.loginForm.invalid) {
         return;
     }
     this.userlogin=new User(this.f.username.value,this.f.password.value);
     this.loading = true;
     console.log(this.userlogin);
    this.authService.login(this.userlogin).subscribe(
      data => {  
        /*
        this.tokenStorage.saveToken(data.user.accessToken);
        */
        this.tokenStorage.saveUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
        
        if(this.roles[0]=="ADMIN"){
          this.router.navigate(['/adminsdashboard']);
        }
        else{
 
          this.router.navigate(['/userpage/:'+this.tokenStorage.getUser().id ]);
          
        }
        /*
        this.reloadPage();
        */

      },
      err => {
        this.isLoginFailed = true;
        this.errorMessage = err.error.message;
        this.loading = false;
      }
    );
  }
/*
  reloadPage() {
    window.location.reload();
  }
*/
}




/*
import { Component, OnInit,Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Role } from '../models/Role.model';
import { Route } from '@angular/compiler/src/core';
import { EmployeService } from '../services/Employe.service';
import { UserService } from '../services/User.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  id: number;
  roles:Role[];
  auth:boolean = false;
  connexionForm: FormGroup;
  constructor(private router: Router,private formBuilder: FormBuilder) { }
  
  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.connexionForm = this.formBuilder.group({
      username:[''],
      password: ['' ]
    });
  }
  
  onSubmitForm() {
    
    const formValue = this.connexionForm.value;
    this.id=formValue['username'];

  if(this.id==0){
    this.router.navigate(['/adminsdashboard']);
  }
  else{
this.router.navigate(['/userpage/:'+this.id]);
      }
    }

  }
    
   

*/









