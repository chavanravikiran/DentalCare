import {Component, OnInit,Input,Output,EventEmitter , inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideIconsModule } from '@shared/modules/lucide-icons.module';
import { AuthService } from '../../../../../core/services/auth.service';
@Component({
  selector: 'app-user-header',
  imports: [CommonModule, RouterModule, LucideIconsModule],
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  @Input() fullName: string | null = null;
  @Output() logout = new EventEmitter<void>();

  private authService = inject(AuthService);
  ngOnInit(): void {
    const decoded = this.authService.getDecodedToken();
    this.fullName = decoded ? decoded.sub : 'Utilisateur';
  }


}
