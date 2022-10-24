import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddcarpoolComponent } from './addcarpool.component';

describe('AddcarpoolComponent', () => {
  let component: AddcarpoolComponent;
  let fixture: ComponentFixture<AddcarpoolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddcarpoolComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddcarpoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
