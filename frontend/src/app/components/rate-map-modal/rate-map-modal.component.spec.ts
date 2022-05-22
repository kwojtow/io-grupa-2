import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateMapModalComponent } from './rate-map-modal.component';

describe('RateMapModalComponent', () => {
  let component: RateMapModalComponent;
  let fixture: ComponentFixture<RateMapModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RateMapModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RateMapModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
