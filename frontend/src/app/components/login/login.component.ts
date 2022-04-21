import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/core/services/data.service';
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
    private dataService: DataService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.showErrorMessage = false;
    this.signinForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
    this.dataService.currentUserName.subscribe();
  }

  onSubmit() {
    if (this.signinForm.valid) {
      this.userService.logUser(this.signinForm.value).subscribe(
        () => {
          this.dataService.setUserName(this.signinForm.value.username);
          this.route.navigate(['/start']);
        },
        () => {
          this.showErrorMessage = true;
        }
      );
    }
  }
}
