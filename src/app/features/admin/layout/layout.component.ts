import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';

import { AuthService, ROUTE_PATHS } from '../../../core';
import { SidebarComponent, HeaderComponent } from '../../../shared/components';

@Component({
  selector: 'app-admin-layout',
  imports: [CommonModule, RouterOutlet, SidebarComponent, HeaderComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // State
  isSidebarOpen = signal(true);
  currentUser = this.authService.currentUser;

  toggleSidebar(): void {
    this.isSidebarOpen.update(value => !value);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl(ROUTE_PATHS.AUTH.LOGIN);
  }
}
