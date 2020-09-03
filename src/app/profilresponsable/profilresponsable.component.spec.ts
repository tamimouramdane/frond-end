import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilresponsableComponent } from './profilresponsable.component';

describe('ProfilresponsableComponent', () => {
  let component: ProfilresponsableComponent;
  let fixture: ComponentFixture<ProfilresponsableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilresponsableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilresponsableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
