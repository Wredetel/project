import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm = new FormGroup({
    login: new FormControl('', [Validators.maxLength(20), Validators.required]),
    password: new FormControl('', [Validators.maxLength(20), Validators.required]),
    rememberMe: new FormControl('')
  })
  get login() { return this.loginForm.controls['login'] }
  get password() { return this.loginForm.controls['password'] }
  get rememberMe() { return this.loginForm.controls['rememberMe'] }

constructor(private userServise: UserService){
this.userServise.errors.subscribe(
  ()=>this.loginForm.setErrors({'badLogin':true})
);
}
  onSubmit(){
const login= this.loginForm.get('login')?.value!;
const password= this.loginForm.get('password')?.value!;
const rememberMe= this.loginForm.get('rememberMe')?.value!;
this.userServise.login(login,password,rememberMe as unknown as boolean);
}
}
