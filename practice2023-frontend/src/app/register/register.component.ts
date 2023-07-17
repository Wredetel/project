import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registerForm = new FormGroup({
    login: new FormControl('', [Validators.minLength(3), Validators.maxLength(20), Validators.required, Validators.pattern('[A-Za-z0-9\_]+')]),
    email: new FormControl('', [Validators.email, Validators.maxLength(31), Validators.required]),
    password: new FormControl('', [Validators.minLength(6), Validators.maxLength(20), Validators.required, Validators.pattern('[A-Za-z0-9\_]+')]),
    passwordConfirm: new FormControl(''),
    lastName: new FormControl('', [Validators.maxLength(31)]),
    firstName: new FormControl('', [Validators.maxLength(31)]),
    contactInfo: new FormControl('', [Validators.maxLength(255)]),
    about: new FormControl('', [Validators.maxLength(255)]),
    achievement: new FormControl('', [Validators.maxLength(255)]),
    avatar: new FormControl(''),
    fileSource: new FormControl('')
  });

  get login() { return this.registerForm.controls["login"] };
  get email() { return this.registerForm.controls["email"] };
  get password() { return this.registerForm.controls["password"] };
  get passwordConfirm() { return this.registerForm.controls["passwordConfirm"] };
  get lastName() { return this.registerForm.controls["lastName"] };
  get firstName() { return this.registerForm.controls["firstName"] };
  get contactInfo() { return this.registerForm.controls["contactInfo"] };
  get about() { return this.registerForm.controls["about"] };
  get achievements() { return this.registerForm.controls["achievement"] };

  currentFile?: File;
  preview = '';

  baseUrl = '';

  constructor(private http: HttpClient, @Inject('BASE_API_URL') baseUrl: string, private router: Router, private userService: UserService) {
    this.baseUrl = baseUrl;
  }

  ngOnInit() {
    this.registerForm.get("passwordConfirm")?.addValidators([Validators.maxLength(20), Validators.required, this.passwordsMatch()]);
  }

  selectFile(event: any): void {
    if (event.target.files) {
      const file = event.target.files[0];
      if (file) {
        this.preview = '';
        this.currentFile = file;
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.preview = e.target.result;
        };
        reader.readAsDataURL(this.currentFile!);

        this.registerForm.patchValue({
          fileSource: file
        });
      }
    }
  }

  passwordsMatch(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = this.registerForm.get("password")?.value;
      const passwordConfirm = this.registerForm.get("passwordConfirm")?.value;
      if (password != passwordConfirm) {
        return { 'passwordsMistmatch': true }
      }
      return null;
    }
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formData = new FormData();

      formData.append('login', this.registerForm.get('login')?.value!);
      formData.append('email', this.registerForm.get('email')?.value!);
      formData.append('password', this.registerForm.get('password')?.value!);
      formData.append('lastName', this.registerForm.get('lastName')?.value!);
      formData.append('firstName', this.registerForm.get('firstName')?.value!);
      formData.append('contactInfo', this.registerForm.get('contactInfo')?.value!);
      formData.append('about', this.registerForm.get('about')?.value!);
      formData.append('achievements', this.registerForm.get('achievements')?.value!);

      if (this.registerForm.get('fileSource')?.value) {
        formData.append('file', this.registerForm.get('fileSource')?.value!);
      }

      this.http.post(this.baseUrl + '/Register', formData).subscribe({
        next: (result) => {
          this.userService.login(this.registerForm.get('login')?.value!, this.registerForm.get('password')?.value!, false);
          this.router.navigate(['']);
        },
        error: (e) => {
          if (e.error.message == 'Login already in use') {
            this.login.setErrors({ 'alreadyInUse': true });
          }
          if (e.error.message == 'Email already in use') {
            this.email.setErrors({ 'alreadyInUse': true });
          }
        }
      });
    }


  }
}
