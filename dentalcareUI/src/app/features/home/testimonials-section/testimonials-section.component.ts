import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { LucideIconsModule} from '@shared/modules/lucide-icons.module';
import { NgForOf, NgClass } from '@angular/common';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-testimonials-section',
  standalone: true,
  templateUrl: './testimonials-section.component.html',
  styleUrls: ['./testimonials-section.component.css'],
  imports: [LucideIconsModule, NgClass, NgForOf,NgOptimizedImage ]
})
export class TestimonialsSectionComponent implements OnInit, AfterViewInit {
  testimonials = [
    {
      name: 'Sophie Martin',
      comment: 'A fantastic team, a warm welcome, and impeccable care. Thank you DentalCare! !',
      rating: 5,
      photo: 'assets/images/review-2.jpg'
    },
    {
      name: '',
      comment: 'Professionalism and a gentle touch. I highly recommend them to anyone looking for a reputable practice.',
      rating: 4,
      photo: 'assets/images/review-4.jpg'
    },
    {
      name: 'Claire Dupont',
      comment: 'Beautiful premises, clear explanations, and a team that is always smiling.',
      rating: 5,
      photo: 'assets/images/review-6.jpg'
    }
  ];

  currentIndex = 0;
  intervalId: any;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.startAutoSlide();
  }

  get currentTransform(): string {
    return `translateX(-${this.currentIndex * 100}%)`;
  }

  startAutoSlide(): void {
    this.intervalId = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
    }, 5000); // Slide toutes les 5 secondes
  }

  ngAfterViewInit(): void {
    const elements = this.el.nativeElement.querySelectorAll('.animate-fade-in-up');
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    elements.forEach((el: Element) => observer.observe(el));
  }
}
