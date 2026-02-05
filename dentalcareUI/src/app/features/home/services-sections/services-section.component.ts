import {AfterViewInit, Component, ElementRef} from '@angular/core';
import {LucideIconsModule} from '@shared/modules/lucide-icons.module';

@Component({
  selector: 'app-services-section',
  imports: [
    LucideIconsModule
  ],
  standalone: true,
  templateUrl: './services-section.component.html',
  styleUrl: './services-section.component.css'
})
export class ServicesSectionComponent implements AfterViewInit{
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
