import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DivisionListComponent } from './division-list/division-list.component';
import { FilialeListComponent } from './filiale-list/filiale-list.component';
import { DirectionListComponent } from './direction-list/direction-list.component';
import { EmployeListComponent } from './employe-list/employe-list.component';
import {PosteListComponent} from './poste-list/poste-list.component';
import { DirectionService } from './services/Direction.service';
import { DivisionService } from './services/Division.service';
import { EmployeService } from './services/Employe.service';
import { FilialeService } from './services/Filiale.service';
import { PosteService } from './services/Poste.service';
import { ServiceService } from './services/Service.service';
import { AuthService } from './services/auth.service';
import { AuthComponent } from './auth/auth.component';
import { ServiceListComponent } from './service-list/service-list.component';
import { ObjectifListComponent } from './objectif-list/objectif-lis.component';
import { ObjectifService } from './services/Objectif.service';
import { ModEmployeComponent } from './mod-employe/mod-employe.component';

import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserService } from './services/user.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AdminsdashboardComponent } from './adminsdashboard/adminsdashboard.component';
import { FourOhFourComponent } from './four-oh-four/four-oh-four.component';
import { UserpageComponent } from './userpage/userpage.component';
import { ProfilresponsableComponent } from './profilresponsable/profilresponsable.component';
import { ProfilcollaborateurComponent } from './profilcollaborateur/profilcollaborateur.component';
import { FixationComponent } from './fixation/fixation.component';
import { Role } from './models/Role.model';
import { RegisterComponent } from './register/register.component';
import { authInterceptorProviders } from './_helpers/auth.interceptor';
import { AuthGuard } from './_helpers/auth.guard';
import { EvaluationService } from './services/Evaluation.service';
import { PhaseService } from './services/phase.service';


import {TableModule} from 'primeng/table';

import {DropdownModule} from 'primeng/dropdown';
import {AccordionModule} from 'primeng/accordion';     //accordion and accordion tab
 

import { PanelModule } from 'primeng/panel';
import {ButtonModule} from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MonProfilComponent } from './mon-profil/mon-profil.component';
import { EvaluationComponent } from './evaluation/evaluation.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CollComponent } from './coll/coll.component';
import { FixationcolComponent } from './fixationcol/fixationcol.component';
import { EvaluationcolComponent } from './evaluationcol/evaluationcol.component';
import { FormationComponent } from './formation/formation.component';
import { FormationService } from './services/Formation.service';
import { FormationcolComponent } from './formationcol/formationcol.component';
import { EvolutioncolComponent } from './evolutioncol/evolutioncol.component';
import { ValidationComponent } from './validation/validation.component';
import { ValidationcolComponent } from './validationcol/validationcol.component';
import { EvolutionComponent } from './evolution/evolution.component';
import { EvolutionService } from './services/evolution.service';
import {ValidationService} from'./services/Validation.service'


const appRoutes: Routes = [


  { path: 'auth', component:AuthComponent },
  { path: 'register', component:RegisterComponent},
  { path: 'adminsdashboard' , component: AdminsdashboardComponent  ,
   canActivate: [AuthGuard] ,  /*
  data: { roles: [Role.Admin] }, */
  children: [
    { path: 'divisions', component: DivisionListComponent },
    { path: 'filiales', component: FilialeListComponent },
    /*
    children: [
    { path: 'new-filiale', component: NewFilialeComponent },
    ] }, */
    { path: 'directions', component: DirectionListComponent },
    { path: 'services', component: ServiceListComponent },
    { path: 'postes', component: PosteListComponent },
    { path: 'employes', component: EmployeListComponent },

    { path: 'employe/:CodeEmploye', component: ModEmployeComponent },
    { path: 'objectifs', component:ObjectifListComponent},
    { path: '',redirectTo: 'divisions',pathMatch:'full'}
  ]  
  },

  { path: 'userpage/:id', component:UserpageComponent  ,
   canActivate: [AuthGuard],
 
 children: [
  
  {path: 'profilresponsable', component:ProfilresponsableComponent },
        
        
       {path: 'profilresponsable/coll/:id', component:CollComponent, 
            children:[
              {path: 'fixation', component:FixationComponent},
              {path: 'evaluation', component:EvaluationComponent},
              {path: 'validation', component:ValidationComponent},
              {path: 'formation', component:FormationComponent},
              {path: 'evolution', component:EvolutionComponent},
              { path: '',   redirectTo: 'fixation', pathMatch: 'full' }
            ] },
    
  {path: 'profilcollaborateur', component:ProfilcollaborateurComponent, 
  children:[
    {path: 'fixationcol', component:FixationcolComponent},
    {path: 'evaluationcol', component:EvaluationcolComponent},
    {path: 'validationcol', component:ValidationcolComponent},
    {path: 'formationcol', component:FormationcolComponent},
    {path: 'evolutioncol', component:EvolutioncolComponent},
    { path: '',   redirectTo: 'fixationcol', pathMatch: 'full' }
  ] },
  {path: 'monprofil', component:MonProfilComponent},
/* {path: 'monprofil', component:MonProfilComponent},*/
 
{ path: '',   redirectTo: 'profilresponsable', pathMatch: 'full' }
 ]
  }  ,
  { path: '',component:AuthComponent}
  

/*
  { path: 'not-found', component: FourOhFourComponent },
  { path: '**', redirectTo: 'not-found' }
*/
];

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    DivisionListComponent,
    FilialeListComponent,
    DirectionListComponent,
    EmployeListComponent,
    ServiceListComponent,
    PosteListComponent,
    ObjectifListComponent,
    ModEmployeComponent,
    AdminsdashboardComponent,
    FourOhFourComponent,
    UserpageComponent,
    ProfilresponsableComponent,
    ProfilcollaborateurComponent,
    FixationComponent,
    RegisterComponent,
    EvaluationComponent, 
    MonProfilComponent,
    CollComponent,
    FixationcolComponent,
    EvaluationcolComponent,
    FormationComponent,
    FormationcolComponent,
    EvolutionComponent,
    EvolutioncolComponent,
    ValidationComponent,
    ValidationcolComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    LayoutModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    
    TableModule,
    DropdownModule,
    AccordionModule,
    RadioButtonModule,
    ButtonModule,
    PanelModule,
    NgbModule,
    MatDialogModule
    
  ],
  exports: [RouterModule],
  providers: [
    DivisionService,
    DirectionService,
    EmployeService,
    FilialeService,
    PosteService,
    ServiceService,
    ObjectifService,
    AuthService,
    UserService,
    EvaluationService,
    FormationService,
    PhaseService ,
    EvolutionService,
    ValidationService,
    authInterceptorProviders
   
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
