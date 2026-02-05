import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger,
  keyframes
} from '@angular/animations';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.css'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        query('.hero-content > *', [
          style({ opacity: 0, transform: 'translateY(50px)' }),
          stagger(200, [
            animate('800ms cubic-bezier(0.35, 0, 0.25, 1)',
              style({ opacity: 1, transform: 'translateY(0)' })
            )
          ])
        ], { optional: true })
      ])
    ]),
    trigger('slideInLeft', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-100px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('float', [
      transition('* => *', [
        animate('3s ease-in-out', keyframes([
          style({ transform: 'translateY(0px)', offset: 0 }),
          style({ transform: 'translateY(-10px)', offset: 0.5 }),
          style({ transform: 'translateY(0px)', offset: 1 })
        ]))
      ])
    ])
  ]
})
export class HeroSectionComponent implements OnInit, OnDestroy {
  @ViewChild('heroVideo', { static: false }) heroVideo!: ElementRef<HTMLVideoElement>;

  isLoaded = false;
  currentStatIndex = 0;
  statsInterval?: number;

  stats = [
    { number: '500+', label: 'Satisfied patients' },
    { number: '15+', label: 'Years of experience' },
    { number: '100%', label: 'Modern equipment' },
    { number: '24/7', label: 'Emergency support' }
  ];

  ngOnInit(): void {
    this.initializeAnimations();
    this.startStatsAnimation();
  }

  ngOnDestroy(): void {
    if (this.statsInterval) {
      clearInterval(this.statsInterval);
    }
  }

  private initializeAnimations(): void {
    // Add intersection observer for scroll-triggered animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe elements for animation
    setTimeout(() => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach((el) => observer.observe(el));
    }, 100);
  }

  private startStatsAnimation(): void {
    // Animate stats counter
    this.statsInterval = window.setInterval(() => {
      this.currentStatIndex = (this.currentStatIndex + 1) % this.stats.length;
    }, 3000);
  }

  onBookAppointment(): void {
    // Scroll to appointment section or navigate to booking page
    const appointmentSection = document.getElementById('appointment-section');
    if (appointmentSection) {
      appointmentSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Navigate to booking page
      window.location.href = '/user-account/prendre-rdv';
    }
  }

  onViewServices(): void {
    const servicesSection = document.getElementById('services-section');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/services';
    }
  }

  onScrollDown(): void {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  }

  // Utility method to handle video loading
  onVideoLoaded(): void {
    this.isLoaded = true;
    if (this.heroVideo?.nativeElement) {
      this.heroVideo.nativeElement.play().catch(error => {
        console.log('Video autoplay failed:', error);
      });
    }
  }
}
