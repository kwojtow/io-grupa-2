import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from '../app.component';
import { LoginComponent } from '../components/login/login.component';
import { RegisterSuccessComponent } from '../components/register/register-success/register-success.component';
import { RegisterComponent } from '../components/register/register.component';
import { StartPageComponent } from '../components/start-page/start-page.component';
import {GameComponent} from "../components/game/game.component";
import { CreateGameRoomComponent } from '../shared/components/create-game-room/create-game-room.component';
import { GameRoomComponent } from '../shared/components/game-room/game-room.component';
import { JoinGameRoomComponent } from '../shared/components/join-game-room/join-game-room.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'signin', component: LoginComponent },
  { path: 'signup', component: RegisterComponent },
  { path: 'success', component: RegisterSuccessComponent },
  { path: 'start', component: StartPageComponent },
  { path: 'game', component: GameComponent}
];
const routes: Routes = [
  { path: 'create-game-room', component: CreateGameRoomComponent},
  { path: 'join-game-room', component: JoinGameRoomComponent},
  { path: 'game-room/:id', component: GameRoomComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
