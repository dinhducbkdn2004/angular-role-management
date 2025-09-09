import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Employee } from '../../../core/models';

@Component({
  selector: 'app-employee-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-card.component.html',
  styleUrl: './employee-card.component.css'
})
export class EmployeeCardComponent {
  // Inputs
  employee = input.required<Employee>();
  isSelected = input<boolean>(false);

  // Outputs
  cardClick = output<Employee>();
  edit = output<Employee>();
  delete = output<Employee>();

  onCardClick(): void {
    this.cardClick.emit(this.employee());
  }

  onEdit(event: Event): void {
    event.stopPropagation();
    this.edit.emit(this.employee());
  }

  onDelete(event: Event): void {
    event.stopPropagation();
    this.delete.emit(this.employee());
  }
}
