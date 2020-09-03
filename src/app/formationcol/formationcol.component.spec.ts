import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormationcolComponent } from './formationcol.component';

describe('FormationcolComponent', () => {
  let component: FormationcolComponent;
  let fixture: ComponentFixture<FormationcolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormationcolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormationcolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
