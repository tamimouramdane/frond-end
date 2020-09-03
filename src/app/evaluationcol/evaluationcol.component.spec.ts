import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationcolComponent } from './evaluationcol.component';

describe('EvaluationcolComponent', () => {
  let component: EvaluationcolComponent;
  let fixture: ComponentFixture<EvaluationcolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluationcolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluationcolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
