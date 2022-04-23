import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/core/services/data.service';

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
    private dataService: DataService
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
    if (!this.joinForm.valid) {
      this.showErrorMessage = true;
    }
  }
}
