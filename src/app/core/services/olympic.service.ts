import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { OlympicCountry } from '../models/Olympic';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<OlympicCountry[]>([]);

  constructor(private http: HttpClient) {}

  loadInitialData(): Observable<OlympicCountry[]> {
    return this.http.get<OlympicCountry[]>(this.olympicUrl).pipe(
      tap((data) => this.olympics$.next(data)),
      catchError((error, caught) => {
        console.error(error);
        this.olympics$.next([]);
        return caught;
      })
    );
  }

  getOlympics(): Observable<OlympicCountry[]> {
    return this.olympics$.asObservable();
  }

  /** calcule du total des médailles */
  getTotalMedals(country: OlympicCountry): number {
    return country.participations
      ? country.participations.reduce((sum, p) => sum + p.medalsCount, 0)
      : 0;
  }
  /** Calcule du nombre de participations aux JO */
  getTotalParticipations(country: OlympicCountry): number {
    return country.participations.length;
  }

  /** Calcule du nombre total d'athlètes présentés aux JO */
  getTotalAthletes(country: OlympicCountry): number {
    return country.participations.reduce((sum, p) => sum + p.athleteCount, 0);
  }
}
