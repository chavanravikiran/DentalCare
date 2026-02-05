import { Component } from '@angular/core';
import { HeroSectionComponent } from '../hero-section/hero-section.component';
import {AboutSectionComponent} from '../about-section/about-section.component';
import {ServicesSectionComponent} from '../services-sections/services-section.component';
import {TestimonialsSectionComponent} from '../testimonials-section/testimonials-section.component';
import {AppointmentCtaSectionComponent} from '../appointment-cta-section/appointment-cta-section.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
  imports: [HeroSectionComponent, AboutSectionComponent, ServicesSectionComponent, TestimonialsSectionComponent, AppointmentCtaSectionComponent]

})
export class HomePageComponent {}
