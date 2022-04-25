import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameRoomService } from 'src/app/core/services/game-room.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-join-game-room',
  templateUrl: './join-game-room.component.html',
  styleUrls: ['./join-game-room.component.css']
})
export class JoinGameRoomComponent implements OnInit {

  constructor(
    private router : Router, 
    private gameRoomService : GameRoomService,
    private userService: UserService
    ) { }

  ngOnInit(): void {
  }

  join(id : string) : void{
    let idNumber = parseInt(id)

    this.gameRoomService.addUser(idNumber, this.userService.getCurrentLoggedUserId()).subscribe(() => this.router.navigate(["game-room", id]));
    
  }

}
