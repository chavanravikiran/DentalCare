// src/app/features/user-account/components/layout/sidebar/sidebar.component.ts

import {Component, Input, Output, EventEmitter, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideIconsModule } from '@shared/modules/lucide-icons.module';
import { AuthService } from '../../../../../core/services/auth.service';
@Component({
  selector: 'app-user-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideIconsModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class UserSidebarComponent {
  @Input() isOpen: boolean = true;
  @Output() toggleSidebar = new EventEmitter<void>();

  private authService = inject(AuthService);
  navItems = [
    { label: 'Accueil', icon: 'Home', route: '/user-account/accueil' },
    { label: 'Mes RDV', icon: 'Calendar', route: '/user-account/mes-rdv' },
    { label: 'Prendre RDV', icon: 'CalendarDays', route: '/user-account/prendre-rdv' },
    { label: 'Messages', icon: 'MessageSquare', route: '/user-account/messages' },
    { label: 'Mon Profil', icon: 'UserCog', route: '/user-account/profil' }
  ];

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  onLogout(): void {
    this.authService.logout(); // 🔒 Secure disconnection
  }
}


