import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './navigation/app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './shared/components/map/map.component';
import { GameRoomComponent } from './shared/components/game-room/game-room.component';
import { CreateGameRoomComponent } from './shared/components/create-game-room/create-game-room.component';
import { JoinGameRoomComponent } from './shared/components/join-game-room/join-game-room.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    GameRoomComponent,
    CreateGameRoomComponent,
    JoinGameRoomComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
