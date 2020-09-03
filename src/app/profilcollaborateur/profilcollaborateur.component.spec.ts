import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilcollaborateurComponent } from './profilcollaborateur.component';

describe('ProfilcollaborateurComponent', () => {
  let component: ProfilcollaborateurComponent;
  let fixture: ComponentFixture<ProfilcollaborateurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilcollaborateurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilcollaborateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
