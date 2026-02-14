import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WebsiteDetails } from '@shared/models/websiteDetails.model';
import { WebsiteService } from '@shared/services/websiteDetails.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  // currentYear = new Date().getFullYear();
  websiteDetails?: WebsiteDetails;

  constructor(private websiteService: WebsiteService) {
    
  }

  ngOnInit(): void {
    // Any initialization logic here
    this.loadWebsite();
  }

  onSocialClick(platform: string): void {
    // Track social media clicks for analytics
    console.log(`Social media click: ${platform}`);
  }

  onContactClick(type: string): void {
    // Track contact interactions for analytics
    console.log(`Contact interaction: ${type}`);
  }
  loadWebsite(): void {
    this.websiteService.getWebsiteDetails('Shree Dental Clinic').subscribe({
      next: (response) => {
        this.websiteDetails = response;
      },
      error: (err) => {
        console.error('Error fetching website details', err);
      }
    });
  }
}
