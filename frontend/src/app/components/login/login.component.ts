import { Component, OnInit } from '@angular/core';

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
