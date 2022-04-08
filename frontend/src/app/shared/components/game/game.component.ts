import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  usersList = new Array('Player1', 'Player2', 'Player3', 'Player1', 'Player1', 'Player2', 'Player3');

  timer = 2;
  constructor() { }

  ngOnInit(): void {
  }

}
