import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideIconsModule } from '@shared/modules/lucide-icons.module';

@Component({
  selector: 'app-card-stats',
  standalone: true,
  imports: [CommonModule, LucideIconsModule],
  templateUrl: './card-stats.component.html',
  styleUrl: './card-stats.component.css'
})
export class CardStatsComponent {
  /**
   * Title of the statistic (e.g., Patients, Income)
   */
  @Input() title: string = '';

  /**
   * Displayed value (e.g., 245 or "1,240 MAD")
   */
  @Input() value: string | number = '';

  /**
   * Lucide icon name (ex: "users", "calendar", "dollar-sign")
   */
  @Input() icon: string = 'activity';

  /**
   * Icon color (Tailwind class, e.g., "text-blue-600 bg-blue-100")
   */
  @Input() color: string = 'text-blue-600 bg-blue-100';

  /**
   * Variation (optional, e.g., "+12%)
   */
  @Input() variation?: string;

  /**
   * Direction of variation (up/down)
   */
  @Input() variationType: 'up' | 'down' | null = null;
}
