import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { RankingService } from 'src/app/core/services/ranking.service';
import { UserService } from 'src/app/core/services/user.service';
import { RankEntry } from 'src/app/payload/RankEntry';
import { User } from 'src/app/shared/models/User';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {

  ranking : RankEntry[];

  constructor(private rankingService : RankingService, private userService : UserService, private router : Router) { }

  ngOnInit(): void {
    this.getRanking();
  }

  getRanking(){
    this.rankingService.getPlayers().subscribe(data => {
      console.log(data)
      this.ranking = data;
    })
  }

  getLoggedUserId(){
    return this.userService.getCurrentLoggedUserId();
  }

  close(){
    this.router.navigate(["/profile"]);
  }

}
