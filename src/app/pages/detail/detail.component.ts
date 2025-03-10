import { Component, OnInit } from '@angular/core';
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
  public totalMedals: number = 0; // Initialisation de la variable

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
        }
      });
    }
  }
}
