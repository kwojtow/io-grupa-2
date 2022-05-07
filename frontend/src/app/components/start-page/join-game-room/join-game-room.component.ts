import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/core/services/data.service';
import { GameRoomService } from 'src/app/core/services/game-room.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-join-game',
  templateUrl: './join-game-room.component.html',
  styleUrls: ['./join-game-room.component.css'],
})
export class JoinGameRoomComponent implements OnInit {
  joinForm: FormGroup;
  showErrorMessage: boolean;
  showNotGameFoundError: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private gameRoomSerivce: GameRoomService,
    private userService: UserService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.showErrorMessage = false;
    this.showNotGameFoundError = false;
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
      this.showErrorMessage = false;
      this.gameRoomSerivce.addUser(
        parseInt(this.joinForm.value.code),
        this.userService.getCurrentLoggedUserId()
      ).subscribe(
        () => {
          this.route.navigate(['/game-room', this.joinForm.value.code]);
        },
        () => {
          this.showNotGameFoundError = true;
        }
      );
    }
    if (!this.joinForm.valid) {
      this.showErrorMessage = true;
    }
  }
}
