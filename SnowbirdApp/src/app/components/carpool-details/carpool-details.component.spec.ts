import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarpoolDetailsComponent } from './carpool-details.component';

describe('CarpoolDetailsComponent', () => {
  let component: CarpoolDetailsComponent;
  let fixture: ComponentFixture<CarpoolDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarpoolDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarpoolDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
