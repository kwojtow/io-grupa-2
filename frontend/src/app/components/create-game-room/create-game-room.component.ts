import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GameRoomService } from 'src/app/core/services/game-room.service';
import { MapService } from 'src/app/core/services/map.service';
import { UserService } from 'src/app/core/services/user.service';
import { MapResponse } from 'src/app/payload/MapResponse';
import { MapDto } from 'src/app/shared/models/MapDto';
import { RaceMap } from 'src/app/shared/models/RaceMap';
import { User } from 'src/app/shared/models/User';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-game-room.component.html',
  styleUrls: ['./create-game-room.component.css'],
})
export class CreateGameRoomComponent implements OnInit, OnDestroy {
  mapOptionsForm: FormGroup;
  mapList: MapResponse[];
  mapDatas: MapDto[] = [];
  maxGamers: number[];
  roundTimes: number[];
  mapDtoMap = new Map<String, MapDto>();

  selectedMapSubscription: Subscription;
  selectedMapId: String;

  constructor(
    private formBuilder: FormBuilder,
    private mapService: MapService,
    private gameRoomService: GameRoomService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.mapOptionsForm = this.formBuilder.group({
      maxGamersNumber: ['1', []],
      roundTime: ['3s', []],
      map: ['1', []],
    });
    this.maxGamers = Array.from({ length: 8 }, (_, i) => i + 1);
    this.roundTimes = [3, 4, 5, 6, 7, 8, 9, 10, 15];
    this.mapService.getMaps().subscribe((result) => {
      this.mapList = result;

      for (let i = 0; i < this.mapList.length; i++) {
        this.getMapData(this.mapList[i].mapId, i);
      }
    });
    this.subscribeToMap();
  }

  ngOnDestroy(): void {
    this.selectedMapSubscription?.unsubscribe();
    this.mapService.clearMap();
  }

  private subscribeToMap() {
    this.selectedMapSubscription = this.mapOptionsForm.controls[
      'map'
    ].valueChanges.subscribe((value) => {
      this.selectedMapId = value;
      this.mapService.clearMap();
      this.setMap();
    });
  }
  private setMap(){
    this.mapService.map.next(this.mapDatas[this.mapDatas.findIndex(map => map.raceMap.mapId == parseInt(this.selectedMapId.toString()))].raceMap)

  }
  getMapData(mapId: number, i: number) {
    let mapDto: MapDto;
    this.mapService.getMap(mapId).subscribe((data: MapResponse) => {
      let mapAuthor: User;
      this.userService
        .getUserData(data.userId)
        .subscribe((data2) => (mapDto.author = data2));
      mapDto = {
        raceMap: new RaceMap(

          data.name,
          data.userId,
          data.width,
          data.height,
          data.mapStructure.finishLine,
          data.mapStructure.startLine,
          data.mapStructure.obstacles,
          data.mapId

        ),
        // name: data.name,
        name: mapId.toString(),
        gamesPlayed: data.gamesPlayed,
        rate: data.rating,
        author: mapAuthor,
      };
      this.mapDatas.push(mapDto);
      this.mapDtoMap.set(mapId.toString(), mapDto);
      this.selectedMapId = this.mapDatas[0].name;
      this.setMap();

    });
  }

  createRoom() {
    if (this.mapOptionsForm.valid) {
      let id: number;
      let mapId: number = parseInt(this.mapOptionsForm.value.map);
      let playersLimit: number = parseInt(
        this.mapOptionsForm.value.maxGamersNumber
      );
      let time: number = parseInt(
        this.mapOptionsForm.value.roundTime.slice(0, -1)
      );
      this.gameRoomService
        .createGameRoom(
          mapId,
          playersLimit,
          time,
          this.userService.getCurrentLoggedUserId()
        )
        .subscribe((data) => {
          id = data.roomId;
          this.gameRoomService
            .addUser(id, this.userService.getCurrentLoggedUserId())
            .subscribe(() => {
              this.router.navigate(['game-room', id]);
            });
        });
    }
  }
}
