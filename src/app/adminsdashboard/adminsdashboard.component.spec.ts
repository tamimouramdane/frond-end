import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminsdashboardComponent } from './adminsdashboard.component';

describe('AdminsdashboardComponent', () => {
  let component: AdminsdashboardComponent;
  let fixture: ComponentFixture<AdminsdashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminsdashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminsdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
