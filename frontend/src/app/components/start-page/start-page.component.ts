import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.css']
})
export class StartPageComponent implements OnInit {
  userName: string;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.currentUserName.subscribe(username => this.userName = username);
  }

}
