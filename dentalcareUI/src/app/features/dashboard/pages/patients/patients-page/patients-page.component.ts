import { Component } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LucideIconsModule } from '@shared/modules/lucide-icons.module';
import { PatientsListComponent } from '../patients-list/patients-list.component';

@Component({
  selector: 'app-patients-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LucideIconsModule,
    PatientsListComponent
  ],
  templateUrl: './patients-page.component.html',
  styleUrls: ['./patients-page.component.css']
})
export class PatientsPageComponent {
  showAddButton = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  /**
   * 🔁 Détecte le composant actif dans le router-outlet
   */
  onComponentChange(componentRef: any): void {
    this.showAddButton = componentRef instanceof PatientsListComponent;
  }

  /**
   * ➕ Bouton de création de patient
   */
  navigateToCreate(): void {
    this.router.navigate(['create'], { relativeTo: this.route }).catch(err =>
      console.error('Navigation échouée :', err)
    );
  }
}
