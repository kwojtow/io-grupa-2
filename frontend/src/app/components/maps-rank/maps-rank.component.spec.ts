import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapsRankComponent } from './maps-rank.component';

describe('MapsRankComponent', () => {
  let component: MapsRankComponent;
  let fixture: ComponentFixture<MapsRankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapsRankComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapsRankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
