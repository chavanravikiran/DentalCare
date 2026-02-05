import { Component, Input } from '@angular/core';
import {LucideIconsModule} from '@shared/modules/lucide-icons.module';

@Component({
  selector: 'app-section-header',
  standalone: true,
  imports: [LucideIconsModule],
  templateUrl: './section-header.component.html',
})
export class SectionHeaderComponent {
  @Input() icon: string = 'Settings';
  @Input() title: string = '';
}
