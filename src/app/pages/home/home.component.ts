import { Component, OnInit, HostListener } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { map } from 'rxjs/operators';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<OlympicCountry[]> = of([]);
  public chartData$: Observable<{ name: string; value: number }[]> = of([]);
  public numberOfCountries$!: Observable<number>;
  public numberOfJo$!: Observable<number>;
  public view: [number, number] = [700, 400];

  public showLabels = true;
  public isDoughnut = false;

  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    this.updateView();

    this.olympics$ = this.olympicService.getOlympics();

    this.numberOfCountries$ = this.olympics$.pipe(map((data) => data.length));

    this.numberOfJo$ = this.olympics$.pipe(
      map((data) => {
        const allYears = new Set<number>();
        data.forEach((country) =>
          country.participations.forEach((p) => allYears.add(p.year))
        );
        return allYears.size;
      })
    );

    this.chartData$ = this.olympics$.pipe(
      map((data) =>
        data.map((country) => ({
          name: country.country,
          value: country.participations.reduce(
            (sum, p) => sum + (p.medalsCount ?? 0), // Assure que medalsCount n'est jamais undefined
            0
          ),
        }))
      )
    );
  }

  onSelect(event: any): void {
    this.olympics$.subscribe((olympics) => {
      const selectedCountry = olympics.find(
        (country) => country.country === event.name
      );
      if (selectedCountry) {
        this.router.navigate([`/detail/${selectedCountry.id}`]);
      } else {
        console.error('Pays non trouvé dans les données !');
      }
    });
  }

  updateView(): void {
    if (window.innerWidth < 768) {
      this.view = [350, 300]; // Mobile
    } else if (window.innerWidth < 1024) {
      this.view = [600, 450]; // Tablette
    } else {
      this.view = [800, 400]; // Grand écran
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.updateView();
  }
}
