import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from '../app.component';
import { LoginComponent } from '../shared/components/login/login.component';
import { RegisterSuccessComponent } from '../shared/components/register/register-success/register-success.component';
import { RegisterComponent } from '../shared/components/register/register.component';
import { StartPageComponent } from '../shared/components/start-page/start-page.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'signin', component: LoginComponent },
  { path: 'signup', component: RegisterComponent },
  { path: 'success', component: RegisterSuccessComponent },
  { path: 'start', component: StartPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
