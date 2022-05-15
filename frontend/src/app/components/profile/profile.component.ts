import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import { Observable} from "rxjs";
import {User} from "../../shared/models/User";
import {MapService} from "../../core/services/map.service";
import {UserService} from "../../core/services/user.service";
import {MapWithStats} from "../../shared/models/MapWithStats";
import {MockDataProviderService} from "../../core/services/mock-data-provider.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  mapList = new Array<MapWithStats>();
  user: User;
  mapListsCategories = new Array<string>( 'Moje mapy', 'Najlepsze mapy', 'Najczęstsze mapy');
  chosenCategory = this.mapListsCategories[0];
  chosenMap: MapWithStats;
  allGames = 12345;// TODO: map stats
  mapRate = '9.5/10';

  constructor(private router: Router,
              private _mapService: MapService,
              private _userService: UserService,
              private _mockData: MockDataProviderService) {
    this.getProfileData();
    // this.getMockProfileData();

  }
  private getMockProfileData(){
    this.mapList = this._mockData.getExampleMapResponseList(3);
    this.user = this._mockData.getExampleUser();
  }

  private getProfileData(){
    this._userService.getUser().subscribe(user => {
        this.user = user
        this._userService.getUserStats(user.userId).subscribe(stats => this.user.statistics = stats);
        this._userService.getUserRanksInfo(user.userId).subscribe(ranks => this.user.ranks = ranks);
        this._userService.getUserMaps(user.userId).subscribe(mapList => {
          this.mapList = mapList
          if(this.mapList.length > 0) this._mapService.map.next(this.mapList[0].raceMap);
        });
      },
      error => {
        if(error.status === 401){
          this.router.navigate(['/']).then();
        }
      }
    );
  }
  ngOnInit(): void {
  }

  switchToStartView() {
    this.router.navigate(['start']).then();
  }

  logout() {
    this.router.navigate(['/']).then(() => localStorage.clear());
  }

  switchToNewMapView() {
    this.router.navigate(['create']).then()
  }

  changeMap(selectRef: HTMLSelectElement) {
    this._mapService.map.next(this.mapList[selectRef.selectedIndex].raceMap);
  }

  changeMapCategory(selectRef: HTMLSelectElement) {
    this.chosenCategory = this.mapListsCategories[selectRef.selectedIndex];
    let mapListObs: Observable<Array<MapWithStats>>;
    if(selectRef.selectedIndex === 0){
      mapListObs = this._userService.getUserMaps(this.user.userId);
    }else if(selectRef.selectedIndex === 1){
      mapListObs = this._userService.getMapsWithMostWins();
    }else if(selectRef.selectedIndex){
      mapListObs = this._userService.getMapsWithMostGames();
    }
    mapListObs.subscribe(mapList => {
      this.mapList = mapList
      if(this.mapList.length > 0) this._mapService.map.next(this.mapList[0].raceMap);
    });
  }
  deleteMap(){
    if(this.chosenMap !== null)
      this._mapService.deleteMap(this.chosenMap.raceMap.mapId);
  }

}
