import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { LucideAngularModule, User, Home, LogOut } from 'lucide-angular';

import { AuthService } from '../../../core';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, LucideAngularModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class UserLayoutComponent {
  // Lucide icons
  readonly User = User;
  readonly Home = Home;
  readonly LogOut = LogOut;

  // Services
  private authService = inject(AuthService);
  private router = inject(Router);

  // Computed properties
  currentUser = this.authService.currentUser;

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
