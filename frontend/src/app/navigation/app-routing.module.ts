import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from '../app.component';
import { LoginComponent } from '../components/login/login.component';
import { RegisterSuccessComponent } from '../components/register/register-success/register-success.component';
import { RegisterComponent } from '../components/register/register.component';
import { StartPageComponent } from '../components/start-page/start-page.component';
import {GameComponent} from "../components/game/game.component";
import { CreateGameRoomComponent } from '../components/create-game-room/create-game-room.component';
import { GameRoomComponent } from '../components/game-room/game-room.component';
import {ProfileComponent} from "../components/profile/profile.component";
import { RankingComponent } from '../components/ranking/ranking.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'signin', component: LoginComponent },
  { path: 'signup', component: RegisterComponent },
  { path: 'success', component: RegisterSuccessComponent },
  { path: 'start', component: StartPageComponent },
  { path: 'game', component: GameComponent},
  { path: 'game/:id', component: GameComponent},
  { path: 'create-game-room', component: CreateGameRoomComponent},
  { path: 'game-room/:id', component: GameRoomComponent },
  { path: 'profile', component: ProfileComponent},
  { path: 'ranking', component: RankingComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
