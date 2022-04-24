import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.css']
})
export class CreateRoomComponent implements OnInit {
  maxGamers: number[];
  roundTime: number[];

  constructor() { }

  ngOnInit(): void {
    this.maxGamers = Array.from({length: 8}, (_, i) => i + 1);
    this.roundTime = [3,4,5,6,7,8,9,10,15];
  }

}
