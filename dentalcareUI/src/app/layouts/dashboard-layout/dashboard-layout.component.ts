import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

import { SidebarComponent } from '../../features/dashboard/components/layout/sidebar/sidebar.component';
import { HeaderComponent } from '../../features/dashboard/components/layout/header/header.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SidebarComponent,
    HeaderComponent
  ],
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.css'],
  animations: [
    trigger('fadeInDashboard', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class DashboardLayoutComponent implements OnInit {
  isSidebarOpen: boolean = true;
  fullName: string | null = null;

  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.fullName = this.authService.getDecodedToken()?.sub || 'Administrateur';
    this.adjustSidebarInitial();

    window.addEventListener('resize', this.adjustSidebarResponsive.bind(this));
  }

  /**
   * Fix initial pour desktop/mobile
   */
  adjustSidebarInitial(): void {
    const isMobile = window.innerWidth < 768;
    this.isSidebarOpen = !isMobile;
    this.cdr.detectChanges(); // ✅ avoids NG0100
  }

  /**
   * Reacts to resize to force the sidebar on desktop
   */
  adjustSidebarResponsive(): void {
    const isMobile = window.innerWidth < 768;
    if (!isMobile) this.isSidebarOpen = true;
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout(): void {
    this.authService.logout();
  }

  isMobile(): boolean {
    return window.innerWidth < 768;
  }
}
