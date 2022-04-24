import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/core/services/data.service';
import { GameRoomService } from 'src/app/core/services/game-room.service';

@Component({
  selector: 'app-join-game',
  templateUrl: './join-game.component.html',
  styleUrls: ['./join-game.component.css'],
})
export class JoinGameComponent implements OnInit {
  joinForm: FormGroup;
  showErrorMessage: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private gameRoomSerivce: GameRoomService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.showErrorMessage = false;
    this.joinForm = this.formBuilder.group({
      code: ['', [Validators.required]],
    });
  }

  changeDialogStatus() {
    this.showErrorMessage = false;
    this.dataService.updateStatus(false);
  }

  onSubmit() {
    if (this.joinForm.valid) {
      this.gameRoomSerivce.joinGameRoom(
        this.joinForm.value.code,
        JSON.parse(localStorage.getItem('jwtResponse')).id
      ).subscribe(
        () => {
          // this.route.navigate(['/room']);
        }
      );
    }
    if (!this.joinForm.valid) {
      this.showErrorMessage = true;
    }
  }
}
