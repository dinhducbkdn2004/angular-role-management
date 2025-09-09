import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { MockDataService } from '../../../core';
import { AdminStats, DashboardCard } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {
  private readonly mockDataService = inject(MockDataService);

  getAdminStats(): Observable<AdminStats> {
    const employees = this.mockDataService.getMockEmployees();
    
    return of({
      totalEmployees: employees.length,
      activeEmployees: employees.filter(emp => emp.status === 'active').length,
      inactiveEmployees: employees.filter(emp => emp.status === 'inactive').length,
      totalDepartments: [...new Set(employees.map(emp => emp.department))].length,
      averageSalary: Math.round(employees.reduce((sum, emp) => sum + emp.salary, 0) / employees.length),
      newEmployeesThisMonth: employees.filter(emp => {
        const now = new Date();
        const empDate = new Date(emp.startDate);
        return empDate.getMonth() === now.getMonth() && empDate.getFullYear() === now.getFullYear();
      }).length
    });
  }

  getDashboardCards(): Observable<DashboardCard[]> {
    return this.getAdminStats().pipe(
      map(stats => [
        {
          title: 'Total Employees',
          value: stats.totalEmployees,
          icon: 'users',
          change: +12,
          changeType: 'increase' as const,
          description: 'Total employees in company'
        },
        {
          title: 'Active Employees',
          value: stats.activeEmployees,
          icon: 'user-check',
          change: +5,
          changeType: 'increase' as const,
          description: 'Currently active employees'
        },
        {
          title: 'Average Salary',
          value: `${(stats.averageSalary / 1000000).toFixed(1)}M VND`,
          icon: 'dollar-sign',
          change: +8,
          changeType: 'increase' as const,
          description: 'Average monthly salary'
        },
        {
          title: 'Departments',
          value: stats.totalDepartments,
          icon: 'building',
          change: 0,
          changeType: 'neutral' as const,
          description: 'Total departments'
        },
        {
          title: 'New This Month',
          value: stats.newEmployeesThisMonth,
          icon: 'user-plus',
          change: +200,
          changeType: 'increase' as const,
          description: 'New employees this month'
        },
        {
          title: 'Inactive',
          value: stats.inactiveEmployees,
          icon: 'user-x',
          change: -2,
          changeType: 'decrease' as const,
          description: 'Inactive employees'
        }
      ])
    );
  }
}
