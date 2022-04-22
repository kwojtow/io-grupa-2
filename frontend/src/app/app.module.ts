import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './navigation/app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { RegisterSuccessComponent } from './components/register/register-success/register-success.component';
import { MapComponent } from './shared/components/map/map.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { StartPageComponent } from './components/start-page/start-page.component';
import { GameComponent } from './components/game/game.component';
import { CreateRoomComponent } from './components/create-room/create-room.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    RegisterSuccessComponent,
    MapComponent,
    StartPageComponent,
    MapComponent,
    GameComponent,
    CreateRoomComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
