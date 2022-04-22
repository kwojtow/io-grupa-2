import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {RaceMap} from "../../shared/models/RaceMap";
import {MapComponent} from "../../shared/components/map/map.component";
import {BehaviorSubject, Subject} from "rxjs";
import {User} from "../../shared/models/User";
import {MapService} from "../../core/services/map.service";
import {Vector} from "../../shared/models/Vector";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  mapList = new Array<RaceMap>();
  user: User;
  private getExampleMap(i: number, j: number){
    const width = 13;
    const height = 10;
    return new RaceMap(width, height, [new Vector(1, 1), new Vector(2, 2)],
      [new Vector((3 + i)%width, (3+j)%height), new Vector(4, 4)],
      [new Vector((7 + j)%width, 5), new Vector(8, 6)]);
  }
  constructor(private router: Router,
              private _mapService: MapService) {
    for(let i = 0; i < 4; i ++){
      this.mapList[i] = this.getExampleMap(i, i+3);
    }
    this._mapService.map.next(this.mapList[0]);
    this.user = new User('User1', 'pwoiegwe', 'User1@email.com', 32, 12345);
  }

  ngOnInit(): void {
  }

  switchToStartView() {
    //router.navigate(['startView']) // TODO
  }

  logout() {
    //TODO
  }

  switchToNewMapView() {
    //router.navigate(['newMapView']) // TODO
  }

  changeMap(selectRef: HTMLSelectElement) {
    this._mapService.map.next(this.mapList[selectRef.selectedIndex]);
  }



}
