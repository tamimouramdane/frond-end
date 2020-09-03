import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvolutioncolComponent } from './evolutioncol.component';

describe('EvolutioncolComponent', () => {
  let component: EvolutioncolComponent;
  let fixture: ComponentFixture<EvolutioncolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvolutioncolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvolutioncolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
