import { Component, ElementRef, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // delete if password recovery is implemented
  isPasswordReset = false;

  constructor() { }

  ngOnInit(): void {

  }

}
