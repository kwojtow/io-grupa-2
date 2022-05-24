import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MapService } from 'src/app/core/services/map.service';
import { MapRankEntry } from 'src/app/payload/MapRankEntry';

@Component({
  selector: 'app-maps-rank',
  templateUrl: './maps-rank.component.html',
  styleUrls: ['./maps-rank.component.css']
})
export class MapsRankComponent implements OnInit {

  ranking : MapRankEntry[];

  constructor(private mapService : MapService, private router : Router) { }

  ngOnInit(): void {
    this.getRanking();
  }

  getRanking(){
    this.mapService.getRank().subscribe(data => {
      console.log(data)
      this.ranking = data;
    })
  }

  close(){
    this.router.navigate(["/profile"]);
  }

}