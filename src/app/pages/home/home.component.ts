import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { map } from 'rxjs/operators';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import { Router } from '@angular/router'; // Ajout du Router pour la navigation

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<OlympicCountry[]> = of([]);
  public chartData$: Observable<{ name: string; value: number }[]> = of([]); // Observable pour les données du graphique
  public view: [number, number] = [700, 400];

  public numberOfCountries$!: Observable<number>;
  public numberOfJo$!: Observable<number>;

  public showLegend = false; // Désactiver la légende comme demandé
  public showLabels = true;
  public isDoughnut = false;

  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();

    this.numberOfCountries$ = this.olympics$.pipe(map((data) => data.length));

    this.numberOfJo$ = this.olympics$.pipe(
      map((data) => {
        const allYears = new Set<number>();
        data.forEach((country) => {
          country.participations.forEach((participation) => {
            allYears.add(participation.year);
          });
        });
        return allYears.size;
      })
    );

    // Calcul des données pour le graphique
    this.chartData$ = this.olympics$.pipe(
      map((data: OlympicCountry[]) => {
        return data.map((country: OlympicCountry) => ({
          name: country.country,
          value: country.participations.reduce(
            (sum, participation) => sum + participation.medalsCount,
            0
          ),
        }));
      })
    );
  }

  onSelect(event: any): void {
    console.log('Élément sélectionné :', event);

    this.olympicService.getOlympics().subscribe((olympics) => {
      const selectedCountry = olympics.find(
        (country:OlympicCountry) => country.country === event.name
      );
      if (selectedCountry) {
        this.router.navigate([`/detail/${selectedCountry.id}`]);
      } else {
        console.error('Pays non trouvé dans les données !');
      }
    });
  }
}
