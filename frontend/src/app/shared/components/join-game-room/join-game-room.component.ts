import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameRoomService } from 'src/app/services/game-room.service';

@Component({
  selector: 'app-join-game-room',
  templateUrl: './join-game-room.component.html',
  styleUrls: ['./join-game-room.component.css']
})
export class JoinGameRoomComponent implements OnInit {

  constructor(private router : Router, private gameRoomService : GameRoomService) { }

  ngOnInit(): void {
  }

  join(id : string) : void{
    let idNumber = parseInt(id)

    this.gameRoomService.joinGameRoom(idNumber);
    this.router.navigate(["game-room", id])
  }

}
