import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {RaceMap} from "../../shared/models/RaceMap";
import {MapComponent} from "../../shared/components/map/map.component";
import {BehaviorSubject, Subject} from "rxjs";
import {User} from "../../shared/models/User";
import {MapService} from "../../core/services/map.service";
import {Vector} from "../../shared/models/Vector";
import {UserStatistics} from "../../shared/models/UserStatistics";
import {UserRanks} from "../../shared/models/UserRanks";
import {UserService} from "../../core/services/user.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  mapList = new Array<RaceMap>();
  user: User;
  mapListsCategories = new Array<string>( 'Moje mapy', 'Najlepsze mapy', 'Najczęstsze mapy');
  chosenCategory = 'Moje mapy';
  // private getExampleMap(i: number, j: number){
  //   const width = 13;
  //   const height = 10;
  //   return new RaceMap(width, height, [new Vector(1, 1), new Vector(2, 2)],
  //     [new Vector((3 + i)%width, (3+j)%height), new Vector(4, 4)],
  //     [new Vector((7 + j)%width, 5), new Vector(8, 6)]);
  // }
  constructor(private router: Router,
              private _mapService: MapService,
              private _userService: UserService) {
    // for(let i = 0; i < 4; i ++){
    //   this.mapList[i] = this.getExampleMap(i, i+3);
    // }
    this._userService.getUser().subscribe(user => {
      this.user = user
      this._userService.getUserStats(user.userId).subscribe(stats => this.user.statistics = stats);
      this._userService.getUserRanksInfo(user.userId).subscribe(ranks => this.user.ranks = ranks);
      this._userService.getUserMaps(user.userId).subscribe(mapList => {
        this.mapList = mapList
        if(this.mapList.length > 0) this._mapService.map.next(this.mapList[0]);
      });
    },
    error => {
      if(error.status === 401){
        this.router.navigate(['/']);
      }
    }
    );
  }

  ngOnInit(): void {
  }

  switchToStartView() {
    this.router.navigate(['start']);
  }

  logout() {
    this.router.navigate(['/']).then(() => localStorage.clear());
  }

  switchToNewMapView() {
    //router.navigate(['newMapView']) // TODO
  }

  changeMap(selectRef: HTMLSelectElement) {
    this._mapService.map.next(this.mapList[selectRef.selectedIndex]);
  }

  changeMapCategory(selectRef: HTMLSelectElement) {
    this.chosenCategory = this.mapListsCategories[selectRef.selectedIndex];
    // TODO: update mapList
  }

}
