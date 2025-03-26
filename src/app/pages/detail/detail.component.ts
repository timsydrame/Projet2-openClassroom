import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { OlympicCountry } from 'src/app/core/models/Olympic';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  public country: OlympicCountry | undefined;
  public totalMedals: number = 0;
  public totalParticipations: number = 0;
  public totalAthletes: number = 0;
  public lineChartData: {
    name: string;
    series: { name: string; value: number }[];
  }[] = [];

  public view: [number, number] = [700, 400]; // Taille du graphique

  // Configuration du graphique
  public showLegend = false;
  public showLabels = true;
  public animations = true;
  public xAxis = true;
  public yAxis = true;
  public showYAxisLabel = true;
  public showXAxisLabel = true;
  public yAxisLabel = 'Nombre de médailles';
  public xAxisLabel = 'Année';
  public timeline = true;
  public yScaleMin!: number;
  public yScaleMax!: number;

  public detailIndicators: { label: string; value: number }[] = [];

  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadCountryData();
    this.updateView();
  }

  private loadCountryData(): void {
    const countryId = this.route.snapshot.params['id'];

    if (countryId) {
      this.olympicService.getOlympics().subscribe((olympics) => {
        this.country = olympics.find(
          (olympic: OlympicCountry) => olympic.id === Number(countryId)
        );

        if (this.country) {
          this.calculateStatistics();
          this.prepareChartData();
          this.updateYAxisScale();
        }
      });
    }
  }

  private calculateStatistics(): void {
    if (!this.country) return;

    this.totalMedals = this.olympicService.getTotalMedals(this.country);
    this.totalParticipations = this.olympicService.getTotalParticipations(
      this.country
    );
    this.totalAthletes = this.olympicService.getTotalAthletes(this.country);

    this.detailIndicators = [
      { label: 'Number of entries', value: this.totalParticipations },
      { label: 'Total number medals', value: this.totalMedals },
      { label: 'Total number of athletes', value: this.totalAthletes },
    ];
  }

 private prepareChartData(): void {
  if (!this.country) return;

  this.lineChartData = [
    {
      name: this.country.country,
      series: this.country.participations.map((participation) => ({
        name: participation.year.toString(),
        value: participation.medalsCount ?? 0, // Assurer que medalsCount n'est jamais undefined
      })),
    },
  ];
}


  private updateYAxisScale(): void {
    if (!this.country?.participations) return;

    const medalsValues = this.country.participations.map((p) => p.medalsCount);
    if (medalsValues.length > 0) {
      this.yScaleMin = Math.max(0, Math.min(...medalsValues) - 5);
      this.yScaleMax = Math.max(...medalsValues) + 5;
    }
  }

  private updateView(): void {
    const width = window.innerWidth;

    if (width < 480) {
      this.view = [width - 20, 250]; // Mobile
    } else if (width < 768) {
      this.view = [width - 50, 300]; // Tablette
    } else if (width <= 1024) {
      this.view = [600, 500]; // Petit écran de bureau
    } else {
      this.view = [800, 400]; // Grand écran
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.updateView();
  }

  xAxisTickFormatting = (tick: number | string): string => tick.toString();

  yAxisTickFormatting = (tick: number | string): string => tick.toString();

  onBack(): void {
    window.history.back();
  }
}
