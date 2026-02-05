import {Component, ElementRef, AfterViewInit} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-about-section',
  imports: [NgOptimizedImage],
  standalone:true,
  templateUrl: './about-section.component.html',
  styleUrl: './about-section.component.css'
})
export class AboutSectionComponent implements AfterViewInit {

  constructor(private el: ElementRef) {}
  ngAfterViewInit(): void {
    const elements = this.el.nativeElement.querySelectorAll(
      '.fade-in-up, .animate-on-scroll'
    );

    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // stop observing after animation
          }
        });
      },
      {
        threshold: 0.15 // triggers at 15% visible for mobile/desktop balance
      }
    );

    elements.forEach((el: Element) => observer.observe(el));
  }
}
