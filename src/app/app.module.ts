import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { DetailComponent } from './pages/detail/detail.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { RouterModule, Routes } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts'; // 👈 Ajoute cette ligne
import { HttpClientModule } from '@angular/common/http'; // 👈 Ajoute ceci si ton service fait des requêtes HTTP

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'details/:country', component: DetailComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DetailComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    NgxChartsModule, // 👈 Ajoute ceci
    HttpClientModule, // 👈 Ajoute ceci si ton service utilise HttpClient
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
