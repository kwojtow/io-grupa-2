import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateGameRoomComponent } from '../shared/components/create-game-room/create-game-room.component';
import { GameRoomComponent } from '../shared/components/game-room/game-room.component';
import { JoinGameRoomComponent } from '../shared/components/join-game-room/join-game-room.component';

const routes: Routes = [
  { path: 'create-game-room', component: CreateGameRoomComponent},
  { path: 'join-game-room', component: JoinGameRoomComponent},
  { path: 'game-room/:id', component: GameRoomComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
