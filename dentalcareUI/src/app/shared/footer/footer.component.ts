import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WebsiteService } from '@shared/services/websiteDetails.service';
import { WebsiteDetails } from '@shared/models/websiteDetails.model';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  websiteDetails?: WebsiteDetails;
  
  constructor(private websiteService: WebsiteService) {}

  ngOnInit(): void {
    // Any initialization logic here
    this.loadWebsite();
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
