import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollComponent } from './coll.component';

describe('CollComponent', () => {
  let component: CollComponent;
  let fixture: ComponentFixture<CollComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
