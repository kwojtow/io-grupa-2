import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameRoomService } from 'src/app/core/services/game-room.service';
import { MapService } from 'src/app/core/services/map.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-create-game-room',
  templateUrl: './create-game-room.component.html',
  styleUrls: ['./create-game-room.component.css']
})
export class CreateGameRoomComponent implements OnInit {

  constructor(private gameRoomService : GameRoomService, private mapService : MapService, private router : Router, private userService : UserService) { }

  ngOnInit(): void {
  }

  create(){

    let id : number;
    this.gameRoomService.createGameRoom(1, 10, 15, this.userService.getCurrentLoggedUserId()).subscribe(data =>{
      id = data.roomId;
      this.gameRoomService.addUser(id, this.userService.getCurrentLoggedUserId()).subscribe(
        () => {
          this.router.navigate(["game-room", id]);
        }
      );
    }
    )

    
  }

}
