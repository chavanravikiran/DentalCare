// src/app/layouts/user-layout/user-layout.component.ts

import { Component, OnInit, inject, HostListener  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserSidebarComponent } from '../../features/user-account/components/layout/sidebar/sidebar.component';
import { HeaderComponent } from '../../features/user-account/components/layout/header/header.component';
import { LucideIconsModule } from '@shared/modules/lucide-icons.module';
@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    UserSidebarComponent,
    HeaderComponent,
    LucideIconsModule
  ],
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.css']
})
export class UserLayoutComponent implements OnInit {
  isSidebarOpen: boolean = true;
  fullName: string | null = null;
  private authService = inject(AuthService);

  ngOnInit(): void {
    const decoded = this.authService.getDecodedToken();
    this.fullName = decoded ? decoded.sub : 'User';//Utilisateur
    // 🔍 Responsive init
    this.isSidebarOpen = window.innerWidth >= 768;
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout(): void {
    this.authService.logout();
  }
  // 📱 Automatic shutdown on small screen
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.isSidebarOpen = event.target.innerWidth >= 768;
  }
}
