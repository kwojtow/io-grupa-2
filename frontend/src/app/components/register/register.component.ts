import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  signupForm: FormGroup;
  showUsernameErrorMessage: boolean;
  showEmailErrorMessage: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private route: Router
  ) {}

  checkPasswordsEquality(control: AbstractControl): ValidationErrors | null {
    return control.get('password').value ===  control.get('confirmPassword').value ? null : { notSame: true };
  }

  ngOnInit(): void {
    this.showUsernameErrorMessage = false;
    this.showEmailErrorMessage = false;
    this.signupForm = this.formBuilder.group(
      {
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20),
          ],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(40),
          ],
        ],
        email: [
          '',
          [
            Validators.required,
            Validators.email,
            Validators.minLength(6),
            Validators.maxLength(40),
          ],
        ],
        confirmPassword: [''],
      },
      { validators: this.checkPasswordsEquality }
    );
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.userService.addUser(this.signupForm.value).subscribe(
        () => {
          this.route.navigate(['/success']);
        },
        (err) => {
          if (err.error === 'Error: Username is already taken!') {
            this.showUsernameErrorMessage = true;
          }
          if(err.error === 'Error: Email is already taken!'){
            this.showEmailErrorMessage = true;
          }
        }
      );
    } else {
      this.signupForm.markAllAsTouched();
    }
  }
}
