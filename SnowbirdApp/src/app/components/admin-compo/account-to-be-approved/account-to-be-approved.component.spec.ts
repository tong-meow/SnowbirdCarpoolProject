import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountToBeApprovedComponent } from './account-to-be-approved.component';

describe('AccountToBeApprovedComponent', () => {
  let component: AccountToBeApprovedComponent;
  let fixture: ComponentFixture<AccountToBeApprovedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountToBeApprovedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountToBeApprovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
