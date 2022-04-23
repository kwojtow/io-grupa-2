import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from '../app.component';
import { CreateRoomComponent } from '../components/create-room/create-room.component';
import { LoginComponent } from '../components/login/login.component';
import { RegisterSuccessComponent } from '../components/register/register-success/register-success.component';
import { RegisterComponent } from '../components/register/register.component';
import { StartPageComponent } from '../components/start-page/start-page.component';
import {GameComponent} from "../components/game/game.component";
import { JoinGameComponent } from '../components/start-page/join-game/join-game.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'signin', component: LoginComponent },
  { path: 'signup', component: RegisterComponent },
  { path: 'success', component: RegisterSuccessComponent },
  { path: 'start', component: StartPageComponent },
  { path: 'create_room', component: CreateRoomComponent},
  { path: 'game', component: GameComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
