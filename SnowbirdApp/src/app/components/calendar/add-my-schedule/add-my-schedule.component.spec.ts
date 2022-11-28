import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMyScheduleComponent } from './add-my-schedule.component';

describe('AddMyScheduleComponent', () => {
  let component: AddMyScheduleComponent;
  let fixture: ComponentFixture<AddMyScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMyScheduleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMyScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
