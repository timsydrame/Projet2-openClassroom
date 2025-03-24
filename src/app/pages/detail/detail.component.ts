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
  public lineChartData: any[] = [];
  public view: [number, number] = [700, 400]; // Taille du graphique
  public showLegend = false;
  public showLabels = true;
  public animations: boolean = true;
  public xAxis: boolean = true;
  public yAxis: boolean = true;
  public showYAxisLabel: boolean = true;
  public showXAxisLabel: boolean = true;
  public yAxisLabel: string = 'Nombre de médailles';
  public xAxisLabel: string = 'Année';
  public timeline: boolean = true;
  public yScaleMin!: number;
  public yScaleMax!: number;
  public detailIndicators: { label: string; value: number }[] = [];

  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID du pays depuis l'URL
    const countryId = this.route.snapshot.params['id'];
    if (countryId) {
      this.olympicService.getOlympics().subscribe((olympics) => {
        this.country = olympics.find(
          (olympic: OlympicCountry) => olympic.id === Number(countryId)
        );
        if (this.country) {
          // Calculer le total des médailles
          this.totalMedals = this.olympicService.getTotalMedals(this.country);
          this.totalParticipations = this.olympicService.getTotalParticipations(
            this.country
          );
          this.totalAthletes = this.olympicService.getTotalAthletes(
            this.country
          );

          // Initialiser detailIndicators
          this.detailIndicators = [
            {
              label: 'Number of entries ',
              value: this.totalParticipations,
            },
            {
              label: 'Total number medals',
              value: this.totalMedals,
            },
            {
              label: ' Total number of athlètes ',
              value: this.totalAthletes,
            },
          ];
          // Organiser les données pour le graphique
          this.lineChartData = [
            {
              name: this.country.country, // Nom du pays comme titre de la série
              series: this.country.participations.map((participation) => ({
                name: participation.year, // L'année
                value: participation.medalsCount, // Nombre de médailles
              })),
            },
          ];
        }
      });
    }

    if (this.country?.participations) {
      // Extraire les valeurs des médailles depuis les participations
      const medalsValues = this.country.participations.map(
        (p) => p.medalsCount
      );

      if (medalsValues.length > 0) {
        const minMedals = Math.min(...medalsValues);
        const maxMedals = Math.max(...medalsValues);

        // Ajouter une marge de 5 médailles en haut et en bas pour plus de lisibilité
        this.yScaleMin = Math.max(0, minMedals - 5);
        this.yScaleMax = maxMedals + 5;
      }
    }
  }

  // Ajuster la taille du graphique en fonction de l'écran
  updateView() {
    const width = window.innerWidth;

    if (width < 480) {
      this.view = [width - 20, 250]; // Mobile : taille dynamique avec un petit padding
    } else if (width < 768) {
      this.view = [width - 50, 300]; // Tablette : largeur ajustée
    } else if (width <= 1024) {
      this.view = [600, 500]; // Tablette et petits écrans de bureau
    } else {
      this.view = [800, 400]; // Grand écran
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.updateView();
  }
  xAxisTickFormatting = (tick: number | string): string => {
    if (!this.country || !this.country.participations) {
      return ''; // Si country est undefined, on retourne une chaîne vide
    }

    const years = this.country.participations.map((part) =>
      part.year.toString()
    );
    return years.includes(tick.toString()) ? tick.toString() : '';
  };

  // 🔹 Formatage des labels de l'axe Y (nombre de médailles)
  yAxisTickFormatting = (tick: number | string): string => {
    return tick.toString();
  };
  onBack(): void {
    window.history.back();
  }
}
