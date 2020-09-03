import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixationcolComponent } from './fixationcol.component';

describe('FixationcolComponent', () => {
  let component: FixationcolComponent;
  let fixture: ComponentFixture<FixationcolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixationcolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixationcolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
