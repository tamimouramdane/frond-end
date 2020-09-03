import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectifListComponent } from './objectif-lis.component';

describe('ObjectifListComponent', () => {
  let component: ObjectifListComponent;
  let fixture: ComponentFixture<ObjectifListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObjectifListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectifListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
