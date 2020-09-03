import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../models/User.model';
import { Router } from '@angular/router';
import { Role } from '../models/Role.model';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {


  constructor(private formBuilder: FormBuilder,private router: Router, private authService: AuthService) { }

  addForm: FormGroup;
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  userregister:User;
  ngOnInit() {
    this.addForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

  }

  onSubmit() {
    const formValue = this.addForm.value;
    this.userregister=new User(    formValue['username'],
   formValue['email'],
   formValue['password']
      );
      console.log(this.userregister);
    this.authService.register(
     this.userregister
    ).subscribe(
      data => {

        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        this.router.navigate(['/auth']);
      },
      err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    );
  }
  /*
  form: any = {};
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
   
  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  onSubmit() {
    this.authService.register(this.form ).subscribe(
      data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
      err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    );
  }
  */
}