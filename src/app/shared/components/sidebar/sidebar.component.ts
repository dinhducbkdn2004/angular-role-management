import { Component, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, BarChart3, Users, Menu, X } from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, LucideAngularModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  // Icons
  readonly BarChart3 = BarChart3;
  readonly Users = Users;
  readonly Menu = Menu;
  readonly X = X;

  // Inputs
  isOpen = input<boolean>(true);

  // Outputs
  toggleSidebar = output<void>();

  onToggle(): void {
    this.toggleSidebar.emit();
  }
}
