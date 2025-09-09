import { Component, input, output } from '@angular/core';
import { LucideAngularModule, LogOut } from 'lucide-angular';
import { User } from '../../../core/models';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  // Icons
  readonly LogOut = LogOut;

  // Inputs
  title = input<string>('Admin Dashboard');
  currentUser = input<User | null>(null);

  // Outputs
  logout = output<void>();

  onLogout(): void {
    this.logout.emit();
  }
}
