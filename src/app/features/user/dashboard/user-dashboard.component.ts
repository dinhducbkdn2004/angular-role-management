import { Component } from '@angular/core';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  template: `
    <div class="user-dashboard">
      <h1>User Dashboard</h1>
      <p>Welcome to the user dashboard. This feature is under development.</p>
    </div>
  `,
  styles: [`
    .user-dashboard {
      padding: 2rem;
      text-align: center;
    }
  `]
})
export class UserDashboardComponent {}
