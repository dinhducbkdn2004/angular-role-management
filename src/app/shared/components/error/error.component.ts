import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ErrorInfo {
  title: string;
  message: string;
  actionLabel?: string;
  showRetry?: boolean;
}

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error.component.html',
  styleUrl: './error.component.css'
})
export class ErrorComponent {
  error = input.required<ErrorInfo>();
  
  retry = output<void>();
  action = output<void>();

  onRetry(): void {
    this.retry.emit();
  }

  onAction(): void {
    this.action.emit();
  }
}
