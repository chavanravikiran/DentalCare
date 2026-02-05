import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-calendar-search-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calendar-search-modal.component.html',
})
export class CalendarSearchModalComponent {
  @Output() closeModal = new EventEmitter<void>();
  /** Unifies the two types of search into a single event */
  @Output() search = new EventEmitter<{ mode: 'name' | 'date', term: string }>();

  mode: 'name' | 'date' = 'name';
  nameQuery: string = '';
  dateQuery: string = '';

  submit(): void {
    if (this.mode === 'name' && this.nameQuery.trim()) {
      this.search.emit({ mode: 'name', term: this.nameQuery.trim() });
    } else if (this.mode === 'date' && this.dateQuery) {
      this.search.emit({ mode: 'date', term: this.dateQuery });
    }
  }

  close(): void {
    this.closeModal.emit();
  }
}
