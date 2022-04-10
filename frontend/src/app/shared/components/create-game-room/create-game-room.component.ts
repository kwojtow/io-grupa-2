import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameRoomService } from 'src/app/services/game-room.service';
import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'app-create-game-room',
  templateUrl: './create-game-room.component.html',
  styleUrls: ['./create-game-room.component.css']
})
export class CreateGameRoomComponent implements OnInit {

  constructor(private gameRoomService : GameRoomService, private mapService : MapService, private router : Router) { }

  ngOnInit(): void {
  }

  create(){
    let id = this.gameRoomService.createGameRoom(this.mapService.getExampleMapData(), 12, 12);

    this.router.navigate(["game-room", id])
  }

}
