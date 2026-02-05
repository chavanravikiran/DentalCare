import { Component, OnInit, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  menuOpen = false;
  isScrolled = false;

  ngOnInit(): void {
    // Initial scroll check
    this.checkScroll();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.checkScroll();
  }

  private checkScroll(): void {
    this.isScrolled = window.pageYOffset > 20;
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const navbar = target.closest('.navbar-area');

    // Close menu if clicking outside navbar
    if (!navbar && this.menuOpen) {
      this.closeMenu();
    }
  }

  @HostListener('window:resize', [])
  onWindowResize(): void {
    // Close mobile menu on desktop size
    if (window.innerWidth >= 1024 && this.menuOpen) {
      this.closeMenu();
    }
  }
}
