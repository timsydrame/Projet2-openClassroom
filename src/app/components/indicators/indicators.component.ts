import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-indicators',
  templateUrl: './indicators.component.html',
  styleUrls: ['./indicators.component.scss'],
})
export class IndicatorsComponent {
  @Input() title: string = ''; // Titre principal (ex: "Medals per Country" ou "Italy - Détails")
  @Input() indicators: { label: string; value: number | string }[] = []; // Liste des indicateurs
}
