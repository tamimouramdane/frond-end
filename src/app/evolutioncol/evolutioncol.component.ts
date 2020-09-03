import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-evolutioncol',
  templateUrl: './evolutioncol.component.html',
  styleUrls: ['./evolutioncol.component.scss']
})
export class EvolutioncolComponent implements OnInit {
  selectedDev;
  submitted;
  echeance;
  mobilite;
  poste;
  constructor() { }

  ngOnInit(): void {
  }
 onChangeDev(e){

 }
}
