import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-instruction',
  templateUrl: './instruction.component.html',
  styleUrls: ['./instruction.component.css']
})
export class InstructionComponent implements OnInit {

  constructor( private route: Router) { }

  ngOnInit(): void {
  }

  refresh(): void {
    // window.location.reload();
    // this.route.navigate( ['/instruction'], {fragment: 'game'});
}

}
