import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  // delete if password recovery is implemented
  isPasswordReset: false;
  signinForm: FormGroup;
  showErrorMessage: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.showErrorMessage = false;
    this.signinForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.signinForm.valid) {
      this.userService.logUser(this.signinForm.value).subscribe(
        (response) => {
          console.log(response);
          window.localStorage.setItem('jwtResponse', JSON.stringify(response));
          this.route.navigate(['/start']);
        },
        () => {
          this.showErrorMessage = true;
        }
      );
    }
  }
}
