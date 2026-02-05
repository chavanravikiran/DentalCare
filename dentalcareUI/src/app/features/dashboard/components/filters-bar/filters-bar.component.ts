import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filters-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filters-bar.component.html',
})
export class FiltersBarComponent {
  selectedMonth = this.formatDateToMonthInput(new Date());

  @Output() monthChanged = new EventEmitter<string>();

  onChange(event: any) {
    this.monthChanged.emit(event.target.value);
  }

  private formatDateToMonthInput(date: Date): string {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  }
}
