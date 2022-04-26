import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameRoomService } from 'src/app/core/services/game-room.service';
import { MapService } from 'src/app/core/services/map.service';
import { UserService} from 'src/app/core/services/user.service';
import { GameRoomDto } from '../../shared/models/GameRoomDto';
import { MapDto } from '../../shared/models/MapDto';
import { UserExtension } from '../../shared/models/UserExtension';
import { RaceMap } from '../../shared/models/RaceMap';
import { Vector } from '../../shared/models/Vector';
import { User } from '../../shared/models/User';
import { GameRoomResponse } from 'src/app/payload/GameRoomResponse';
import { MapResponse } from 'src/app/payload/MapResponse';
import { UserService as UserService2} from 'src/app/core/services/user.service';
import {GameService} from "../../core/services/game.service";
import {Player} from "../../shared/models/Player";
import {Game} from "../../shared/models/Game";
import {MockDataProviderService} from "../../core/services/mock-data-provider.service";
import {GameSettings} from "../../shared/models/GameSettings";

@Component({
  selector: 'app-game-room',
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.css']
})
export class GameRoomComponent implements OnInit {

  gameRoomData : GameRoomDto;
  usersExtensions : UserExtension[] = new Array();

  gameRoomId : number;
  gameStarted: boolean = false;

  timer: number = 3;

  constructor(
    private mapService : MapService,
    private gameRoomService: GameRoomService,
    private userService : UserService,
    private router : Router,
    private route : ActivatedRoute,
    private userService2 : UserService2,
    private gameService: GameService,
    private mockData: MockDataProviderService

    ) {

  }

  ngOnInit(): void {
    this.gameRoomId = +this.route.snapshot.params['id'];

    this.getGameRoomData();

    this.refresh();

  }

  refresh(){
    setTimeout(() => {
      if(this.gameRoomId){
        this.getPlayers(this.gameRoomId);
        this.getGameStarted(this.gameRoomId);
        if(JSON.parse(localStorage.getItem("jwtResponse")) && this.router.url == "/game-room/" + this.gameRoomId){
          this.refresh()
        }
      }
    }, 500);
  }

  makeExpand(player : UserExtension){
    player.extended = !player.extended;
  }

  kick(user : User){
    this.gameRoomService.deleteUser(this.gameRoomId, user.userId).subscribe(() => {
      console.log("User removed")
    });
  }

  ready(){
    return this.gameRoomData && this.gameRoomData.mapDto && this.gameRoomData.owner && this.gameRoomData.mapDto.author;
  }

  isOwner() : boolean{
    if(this.gameRoomData.owner.userId){

      return this.gameRoomData.owner.userId == this.userService.getCurrentLoggedUserId();
    }
    else
      return false;
  }

  leave(){
    this.gameRoomService.deleteUser(this.gameRoomId, this.userService.getCurrentLoggedUserId()).subscribe();
    this.router.navigate(["/start"]);
  }

  close(){
    let usersNumber = this.gameRoomData.usersList.length;
    let counter = 0;
    for(let user of this.gameRoomData.usersList){
      this.gameRoomService.deleteUser(this.gameRoomId, user.userId).subscribe(() => {
        counter += 1;
        if(counter == usersNumber){
          setTimeout(() => this.gameRoomService.deleteGameRoom(this.gameRoomId).subscribe(), 5000)
          this.router.navigate(["/start"])
        }
      });
    }
  }

  startGame(){
    this.gameStarted = true;
    this.gameRoomService.startGame(this.gameRoomId).subscribe();
  }

  getGameRoomData() {
    this.gameRoomService.getGameRoom(this.gameRoomId)
    .subscribe((data: GameRoomResponse) => {

        let mapDto : MapDto;
        this.mapService.getMap(data.mapId).subscribe((data2: MapResponse) => {
          let mapAuthor : User;
          this.userService2.getUserData(data2.userId).subscribe(data3 => mapDto.author = data3)
          mapDto = {
            raceMap : new RaceMap(// TODO: !!!!!!!!!!!!!!
              1,
              'map',
              1,
              data2.width,
              data2.height,
              data2.mapStructure.finishLine,
              data2.mapStructure.startLine,
              data2.mapStructure.obstacles
            ),
            name: data2.name,
            gamesPlayed: 0,
            rate: 0,
            author: mapAuthor
          }
          this.gameRoomData.mapDto = mapDto;
        }
        )

        this.userService2.getUserData(data.gameMasterId).subscribe(data => this.gameRoomData.owner = data);

        this.gameRoomData = {
        id: data.roomId,
        mapDto: null,
        playersLimit: data.playersLimit,
        roundTime: data.roundTime,
        usersList: [],
        owner: null
      }
    }
    )
  }

  getPlayers(roomId: number) {
    console.log(this.gameRoomData)
    this.gameRoomService.getPlayers(roomId).subscribe((data: User[]) => {
      this.gameRoomData.usersList = data;
      for(let user of this.gameRoomData.usersList){
        if(this.usersExtensions.map(userExtension => userExtension.user.userId).includes(user.userId)){

        }
        else{
          this.usersExtensions.push({user: user, extended: false} as UserExtension)
        }
      }

      if(this.usersExtensions.length > this.gameRoomData.usersList.length){
        for(let userExt of this.usersExtensions){
          if(!this.gameRoomData.usersList.includes(userExt.user)){
            this.usersExtensions.splice(this.usersExtensions.indexOf(userExt), 1)
          }
        }
      }
      if(!data.map(user => user.userId).includes(this.userService.getCurrentLoggedUserId())){
        this.router.navigate(["/start"])
      }
    });
  }

  getGameStarted(roomId: number) {
    this.gameRoomService.getGameStarted(roomId).subscribe((data: boolean) => {
      if (!this.gameStarted && data == true) {
        console.log("Starting game")
        this.gameStarted = true;
        this.showModal();
      }
    });
  }

  showModal() {
    setTimeout(() => {
      this.timer -= 1;
      setTimeout(() => {
        this.timer -= 1;
        setTimeout(() => {

          this.userService.getUser().subscribe(user => {
            let player;
            let players = new Array<Player>()
            this.usersExtensions.map(userExtension => userExtension.user)
              .forEach(user => {
                players.push(new Player(user.userId, user.login, new Vector(user.userId,0), 'green'))
              })
            player = players.find(player => player.playerId === user.userId)
            this.gameService.setGameInfo(player, new Game(this.gameRoomId, MockDataProviderService.getExampleMap(), players, new GameSettings(this.timer)))
            this.gameRoomService.startGame1(players, this.gameRoomId).subscribe(response =>{
              this.router.navigate(["/game/" + this.gameRoomId]).then(() =>{

              })
            })
          })

        }, 1000)
      }, 1000)
    }, 1000)

  }

}

