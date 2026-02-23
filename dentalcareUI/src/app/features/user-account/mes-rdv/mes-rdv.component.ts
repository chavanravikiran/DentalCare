import { RendezvousService } from '../../../core/services/rendezvous.service';
import { Component, OnInit, inject } from '@angular/core';
import { RendezVousResponse } from '../../dashboard/models/rendezvous-response.model';
import {LucideAngularModule} from 'lucide-angular';
import {CommonModule, NgClass} from '@angular/common';

@Component({
  selector: 'app-mes-rdv',
  standalone: true,
  templateUrl: './mes-rdv.component.html',  
  imports: [CommonModule, LucideAngularModule, NgClass],

  styleUrls: ['./mes-rdv.component.css']
})
export class MesRdvComponent implements OnInit {
  private rdvService = inject(RendezvousService);
  rdvs: RendezVousResponse[] = [];

  ngOnInit(): void {
    this.loadMyRendezVous();
  }

  loadMyRendezVous(): void {
    this.rdvService.getMyRendezVous().subscribe({
      next: (data: RendezVousResponse[]) => {
        console.log("✅ Appointments retrieved :", data);
        this.rdvs = data;
      },
      error: (err) => {
        console.error("❌ Error loading appointments:", err);
      }
    });
  }

}
