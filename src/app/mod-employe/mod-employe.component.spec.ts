import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModEmployeComponent } from './mod-employe.component';

describe('ModEmployeComponent', () => {
  let component: ModEmployeComponent;
  let fixture: ComponentFixture<ModEmployeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModEmployeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModEmployeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
