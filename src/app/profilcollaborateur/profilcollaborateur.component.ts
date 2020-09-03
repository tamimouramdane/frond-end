import { Component, OnInit, Input ,ViewChild } from '@angular/core';
import { Evaluation } from '../models/Evaluation.model';
import { Employe } from '../models/Employe.model';
import { EmployeService } from '../services/Employe.service';
import { EvaluationService } from '../services/Evaluation.service';
import { EvaluationIndividuelle } from '../models/EvaluationIndividuelle.model';
import { TokenStorageService } from '../services/token-storage.service';
import { User } from '../models/User.model';
import { MatTableDataSource } from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatFormFieldControl} from '@angular/material/form-field'
import {MatPaginatorModule, MatPaginator} from '@angular/material/paginator';

@Component({
  selector: 'app-profilcollaborateur',
  templateUrl: './profilcollaborateur.component.html',
  styleUrls: ['./profilcollaborateur.component.scss']
})
export class ProfilcollaborateurComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }

}
