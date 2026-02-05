import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideIconsModule } from '@shared/modules/lucide-icons.module';
import { PatientService } from '../../../../core/services/patient.service';
import { RendezvousService } from '../../../../core/services/rendezvous.service';
import { RouterModule } from '@angular/router';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-statistiques',
  standalone: true,
  imports: [
    CommonModule,
    LucideIconsModule,
    RouterModule
  ],
  templateUrl: './statistiques.component.html',
  styleUrls: ['./statistiques.component.css']
})
export class StatistiquesComponent implements OnInit {
  totalPatients = 0;
  rdvThisMonth = 0;
  confirmationRate = 0;
  revenue = 0;

  private patientService = inject(PatientService);
  private rendezvousService = inject(RendezvousService);

  ngOnInit(): void {
    this.loadStats();
    setTimeout(() => this.loadFakeCharts(), 300); // ⏱️ Laisse le DOM se rendre avant de dessiner les chartes
  }

  private loadStats(): void {
    this.patientService.getAllPatients().subscribe(patients => {
      this.totalPatients = patients.length;
    });

    this.rendezvousService.getAll().subscribe(rdvs => {
      const now = new Date();
      const monthly = rdvs.filter(r => {
        const d = new Date(r.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });

      this.rdvThisMonth = monthly.length;
      const confirmed = monthly.filter(r => r.status === 'CONFIRME').length;
      this.confirmationRate = monthly.length > 0 ? Math.round((confirmed / monthly.length) * 100) : 0;
    });

    this.revenue = Math.floor(7000 + Math.random() * 4000);
  }

  private loadFakeCharts(): void {
    const lineCtx = document.getElementById('lineChart') as HTMLCanvasElement;
    const pieCtx = document.getElementById('pieChart') as HTMLCanvasElement;

    if (lineCtx) {
      new Chart(lineCtx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
          datasets: [{
            label: 'RDV Confirmés',
            data: [12, 19, 15, 23, 20, 17],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            tension: 0.4,
            fill: true
          }]
        }
      });
    }

    if (pieCtx) {
      new Chart(pieCtx, {
        type: 'doughnut',
        data: {
          labels: ['Consultation', 'Détartrage', 'Urgence'],
          datasets: [{
            data: [50, 30, 20],
            backgroundColor: ['#3b82f6', '#facc15', '#f87171'],
            borderWidth: 1
          }]
        },
        options: {
          cutout: '70%'
        }
      });
    }
  }
}
