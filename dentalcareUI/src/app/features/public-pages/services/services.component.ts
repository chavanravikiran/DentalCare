import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-services',
  imports: [CommonModule, RouterModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit, AfterViewInit {

  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 2;

  serviceCategories = [
    {
      name: 'General Dentistry',
      icon: 'bx-health',
      count: 8
    },
    {
      name: 'Cosmetic Dentistry',
      icon: 'bx-smile',
      count: 6
    },
    {
      name: 'Dental Surgery',
      icon: 'bx-plus-medical',
      count: 4
    },
    {
      name: 'Orthodontics',
      icon: 'bx-grid',
      count: 3
    },
    {
      name: 'Implantology',
      icon: 'bx-cog',
      count: 5
    },
    {
      name: 'Pedodontics',
      icon: 'bx-child',
      count: 4
    }
  ];

  services = [
    {
      title: 'General Dentistry',
      description: 'Comprehensive dental care including examinations, cleanings, fillings and preventative treatments to maintain your optimal oral health.',
      image: 'assets/images/services-1.jpg',
      icon: 'bx-health',
      features: [
        'Comprehensive dental examinations',
        'Professional cleaning',
        'Cosmetic fillings',
        'Preventive treatments'
      ]
    },
    {
      title: 'Cosmetic Dentistry',
      description: 'Transform your smile with our advanced aesthetic treatments: whitening, veneers, and personalized aesthetic corrections.',
      image: 'assets/images/services-2.jpg',
      icon: 'bx-smile',
      features: [
        'Teeth whitening',
        'Porcelain veneers',
        'Cosmetic corrections',
        'Digital smile design'
      ]
    },
    {
      title: 'Dental Implants',
      description: 'Permanent solutions to replace missing teeth with high-quality implants and advanced surgical techniques.',
      image: 'assets/images/services-3.jpg',
      icon: 'bx-cog',
      features: [
        'Premium titanium implants',
        'Computer-guided surgery',
        'Implant-supported crowns',
        'Full restoration'
      ]
    },
    {
      title: 'Orthodontics',
      description: 'Correction of dental malpositions with modern, invisible or traditional appliances, suitable for all ages.',
      image: 'assets/images/services-4.jpg',
      icon: 'bx-grid',
      features: [
        'Invisalign invisible braces',
        'Traditional orthodontics',
        'Teen/adult treatment',
        'Personalized follow-up'
      ]
    },
    {
      title: 'Teeth Whitening',
      description: 'Regain a radiant smile with our safe and effective professional whitening techniques.',
      image: 'assets/images/services-5.jpg',
      icon: 'bx-sun',
      features: [
        'In-office whitening',
        'Custom-made trays',
        'Long-lasting results',
        'Advanced LED technology'
      ]
    },
    {
      title: 'Dental Cleaning',
      description: 'Maintain perfect oral hygiene with our professional cleanings and personalized advice.',
      image: 'assets/images/services-6.jpg',
      icon: 'bx-water',
      features: [
        'Ultrasonic descaling',
        'Professional polishing',
        'Fluoridation',
        'Advice d\'hygiene'
      ]
    }
  ];

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    // Component initialization
  }

  ngAfterViewInit(): void {
    this.initScrollAnimations();
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      // Here you would typically fetch new data for the page
      this.scrollToServices();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  private scrollToServices(): void {
    const servicesSection = this.el.nativeElement.querySelector('.services-grid');
    if (servicesSection) {
      servicesSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  private initScrollAnimations(): void {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');

          // Add staggered animation for service cards
          if (entry.target.classList.contains('service-card')) {
            const index = Array.from(entry.target.parentElement!.children).indexOf(entry.target);
            (entry.target as HTMLElement).style.animationDelay = `${index * 0.1}s`;
          }
        }
      });
    }, observerOptions);

    // Observe all animatable elements
    const elements = this.el.nativeElement.querySelectorAll(
      '.service-card, .category-card, .service-categories'
    );

    elements.forEach((el: Element) => {
      observer.observe(el);
    });

    // Add initial animation styles
    this.addAnimationStyles();
  }

  private addAnimationStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
      .service-card, .category-card, .service-categories {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .service-card.animate-in, .category-card.animate-in, .service-categories.animate-in {
        opacity: 1;
        transform: translateY(0);
      }
      .category-card:nth-child(1).animate-in { transition-delay: 0.1s; }
      .category-card:nth-child(2).animate-in { transition-delay: 0.2s; }
      .category-card:nth-child(3).animate-in { transition-delay: 0.3s; }
      .category-card:nth-child(4).animate-in { transition-delay: 0.4s; }
      .category-card:nth-child(5).animate-in { transition-delay: 0.5s; }
      .category-card:nth-child(6).animate-in { transition-delay: 0.6s; }
    `;
    document.head.appendChild(style);
  }

  // Service interaction methods
  onServiceHover(service: any): void {
    // Could add analytics tracking or preview functionality
    console.log(`Service hovered: ${service.title}`);
  }

  onCategorySelect(category: any): void {
    // Could filter services by category
    console.log(`Category selected: ${category.name}`);
  }

  // Utility methods
  trackByService(index: number, service: any): any {
    return service.title;
  }

  trackByCategory(index: number, category: any): any {
    return category.name;
  }
}
