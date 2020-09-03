import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationcolComponent } from './validationcol.component';

describe('ValidationcolComponent', () => {
  let component: ValidationcolComponent;
  let fixture: ComponentFixture<ValidationcolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidationcolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationcolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
