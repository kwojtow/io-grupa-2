import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from '../app.component';
import { LoginComponent } from '../components/login/login.component';
import { RegisterSuccessComponent } from '../components/register/register-success/register-success.component';
import { RegisterComponent } from '../components/register/register.component';

const routes: Routes = [
  {path: '', component: AppComponent},
  {path: 'signin', component: LoginComponent},
  // {path: 'signup', component: RegisterComponent, children: [
  //   {path: 'success', component: RegisterSuccessComponent}
  // ]}
  {path: 'signup', component: RegisterComponent},
  {path: 'success', component: RegisterSuccessComponent}
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
