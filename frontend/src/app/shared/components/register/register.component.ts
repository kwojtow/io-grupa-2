import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  signupForm: FormGroup;
  showErrorMessage: boolean;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private route: Router) {
 
   }

  ngOnInit(): void {
    this.showErrorMessage = false;
    this.signupForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(40)]],
      email : ['', [Validators.required, Validators.email, Validators.minLength(6), Validators.maxLength(40)]]
    });
  }

  onSubmit(){
  
    if(this.signupForm.valid){
      this.userService.addUser(this.signupForm.value).subscribe(() => {
          this.route.navigate(['/success'])
        
      }, (err) => {
        if(err.error === 'Error: Username is already taken!'){
          this.showErrorMessage = true;
        }
      });
    } else {
      this.signupForm.markAllAsTouched();
    }
    
  }


    
  }


