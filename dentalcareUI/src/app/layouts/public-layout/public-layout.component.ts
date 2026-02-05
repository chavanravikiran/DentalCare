import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '@shared/navbar/navbar.component';
import { FooterComponent } from '@shared/footer/footer.component';
import { HeaderComponent } from '@shared/header/header.component';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-public-layout',
  imports: [CommonModule,RouterOutlet, NavbarComponent, FooterComponent, HeaderComponent],
  standalone : true,
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.css'
})
export class PublicLayoutComponent {

}
