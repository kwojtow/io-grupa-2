import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {RaceMap} from "../../shared/models/RaceMap";
import {MapComponent} from "../../shared/components/map/map.component";
import {BehaviorSubject, Subject} from "rxjs";
import {User} from "../../shared/models/User";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  mapList = new Array<RaceMap>();
  map: BehaviorSubject<RaceMap>;
  user: User;

  constructor(private router: Router) {
    for(let i = 0; i < 4; i ++){
      this.mapList[i] = MapComponent.getExampleMap(i, i+3);
    }
    this.map = new BehaviorSubject<RaceMap>(this.mapList[0]);
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
    this.map.next(this.mapList[selectRef.selectedIndex]);
  }



}
