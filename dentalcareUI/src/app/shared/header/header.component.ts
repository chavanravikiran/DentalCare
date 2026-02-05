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
  currentYear = new Date().getFullYear();
  webisteName ="DR ANAS";
  websiteDetails?: WebsiteDetails;

  constructor(private websiteService: WebsiteService) {
    
  }

  socialLinks = [
    {
      name: 'Facebook',
      url: 'https://www.facebook.com',
      icon: 'bxl-facebook'
    },
    {
      name: 'Twitter',
      url: 'https://www.twitter.com',
      icon: 'bxl-twitter'
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com',
      icon: 'bxl-linkedin'
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com',
      icon: 'bxl-instagram'
    }
  ];

  contactInfo = {
    address: '153 Marrakech Doha',
    email: 'xyz@dentalcare.com',
    phone: '+212 6 00 00 00 00',
    hours: '09:00 - 18:00'
  };

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
    this.websiteService
      .getWebsiteDetails('Shree Dental Clinic')
      .subscribe({
        next: (response) => {
          this.websiteDetails = response;
          console.log('Website details:', response);
        },
        error: (err) => {
          console.error('Error fetching website details', err);
        }
      });
  }
}
