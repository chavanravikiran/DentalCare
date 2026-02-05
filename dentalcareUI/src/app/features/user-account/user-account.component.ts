import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-user-account',
  standalone:true,
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.css']
})
export class UserAccountComponent {

  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}
