import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-about',
  imports: [CommonModule, RouterModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit, AfterViewInit {

  facts = [
    { value: '150+', label: 'Satisfied patients', icon: 'bx-heart' },
    { value: '5+', label: 'Years d\'experience', icon: 'bx-time' },
    { value: '98%', label: 'Satisfaction rate', icon: 'bx-like' },
    { value: '24/7', label: 'Support available', icon: 'bx-support' },
  ];

  features = [
    {
      icon: 'check-circle',
      title: 'Latest generation hardware'
    },
    {
      icon: 'user-group',
      title: 'A passionate and experienced team'
    },
    {
      icon: 'sparkles',
      title: 'Personalized care for each patient'
    },
    {
      icon: 'shield-check',
      title: 'Enhanced hygiene and safety'
    }
  ];

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    // Component initialization
  }

  ngAfterViewInit(): void {
    this.initScrollAnimations();
    this.initCounterAnimations();
  }

  getIconClass(iconName: string): string {
    const iconMap: { [key: string]: string } = {
      'check-circle': 'bx-check-circle',
      'user-group': 'bx-group',
      'sparkles': 'bx-star',
      'shield-check': 'bx-shield-check'
    };
    return iconMap[iconName] || 'bx-check';
  }

  private initScrollAnimations(): void {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');

          // Start counter animation for fact cards
          if (entry.target.classList.contains('fact-card')) {
            this.animateCounter(entry.target);
          }
        }
      });
    }, observerOptions);

    // Observe all animatable elements
    const elements = this.el.nativeElement.querySelectorAll(
      '.feature-item, .fact-card, .testimonial-card, .feature-card, .image-container'
    );

    elements.forEach((el: Element) => {
      observer.observe(el);
    });
  }

  private initCounterAnimations(): void {
    // Add initial styles for animation
    const style = document.createElement('style');
    style.textContent = `
      .feature-item, .fact-card, .testimonial-card, .feature-card, .image-container {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .feature-item.animate-in, .fact-card.animate-in, .testimonial-card.animate-in,
      .feature-card.animate-in, .image-container.animate-in {
        opacity: 1;
        transform: translateY(0);
      }
      .feature-item:nth-child(2).animate-in { transition-delay: 0.1s; }
      .feature-item:nth-child(3).animate-in { transition-delay: 0.2s; }
      .feature-item:nth-child(4).animate-in { transition-delay: 0.3s; }
      .fact-card:nth-child(2).animate-in { transition-delay: 0.1s; }
      .fact-card:nth-child(3).animate-in { transition-delay: 0.2s; }
      .fact-card:nth-child(4).animate-in { transition-delay: 0.3s; }
    `;
    document.head.appendChild(style);
  }

  private animateCounter(element: Element): void {
    const numberElement = element.querySelector('.fact-number') as HTMLElement;
    if (!numberElement) return;

    const finalText = numberElement.textContent || '0';
    if (finalText.includes('/')) {
      numberElement.textContent = finalText;
      return;
    }
    const finalNumber = parseInt(finalText.replace(/\D/g, '')) || 0;
    const suffix = finalText.replace(/[\d,]/g, '');

    let currentNumber = 0;
    const increment = finalNumber / 60; // Animation over ~1 second at 60fps

    const timer = setInterval(() => {
      currentNumber += increment;
      if (currentNumber >= finalNumber) {
        numberElement.textContent = finalNumber + suffix;
        clearInterval(timer);
      } else {
        numberElement.textContent = Math.floor(currentNumber) + suffix;
      }
    }, 16);
  }
}
