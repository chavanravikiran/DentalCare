import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-appointment-cta-section',
  standalone: true,
  templateUrl: './appointment-cta-section.component.html',
  styleUrls: ['./appointment-cta-section.component.css'],
  imports: [RouterLink]
})
export class AppointmentCtaSectionComponent implements AfterViewInit {
  constructor(private el: ElementRef) {}

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
