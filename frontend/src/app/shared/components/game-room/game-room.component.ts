import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameRoomService } from 'src/app/services/game-room.service';
import { MapService } from 'src/app/services/map.service';
import { UserService } from 'src/app/services/user.service';
import { GameRoomDto } from '../../models/GameRoomDto';
import { MapDto } from '../../models/MapDto';
import { UserExtension } from '../../models/UserExtension';
import { RaceMap } from '../../models/RaceMap';
import { Vector } from '../../models/Vector';
import { User } from '../../models/User';

@Component({
  selector: 'app-game-room',
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.css']
})
export class GameRoomComponent implements OnInit {

  gameRoomData : GameRoomDto;
  usersExtensions : UserExtension[] = new Array();

  gameRoomId : number;

  constructor(private mapService : MapService, private gameRoomService: GameRoomService, private userService : UserService, private router : Router, private route : ActivatedRoute) { 

  }

  ngOnInit(): void {
    this.gameRoomId = +this.route.snapshot.params['id'];
    

    this.gameRoomService.changes.subscribe(change => {
      console.log(change)
      this.update();
  });
  }

  makeExpand(player : UserExtension){
    player.extended = !player.extended;
  }

  kick(user : User){
    this.gameRoomService.removePlayer(user)
    this.usersExtensions.splice(this.usersExtensions.map(ue => ue.user).indexOf(user), 1)
  }

  isOwner() : boolean{
    return this.gameRoomData.mapDto.author == this.userService.getCurrentLoggedUser();
  }

  leave(){
    this.gameRoomService.removePlayer(this.userService.getCurrentLoggedUser());
    this.router.navigate(["/"]);
  }

  close(){
    console.log("closing")
      this.gameRoomService.close(this.gameRoomId);
      this.router.navigate(["/"])
  }

  startGame(){
      this.router.navigate(["/game/" + this.gameRoomId])
  }

  update(){
  
    this.gameRoomData = this.gameRoomService.getGameRoom(this.gameRoomId);

    console.log("game room " + this.gameRoomData)

    this.gameRoomData.usersList.forEach(user => {
      this.usersExtensions.push({user: user, extended: false})
    })

  }

}
