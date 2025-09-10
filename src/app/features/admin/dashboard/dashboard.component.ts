import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { AuthService, EmployeeService } from '../../../core';
import { Employee } from '../../../core/models';
import { LoadingComponent } from '../../../shared/components';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, LoadingComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  private readonly authService = inject(AuthService);
  private readonly employeeService = inject(EmployeeService);
  private readonly router = inject(Router);

  currentUser = this.authService.currentUser;
  employees = this.employeeService.employees;
  isLoading = this.employeeService.isLoading;
  currentDate = new Date();

  dashboardData = computed(() => {
    const employees = this.employees();
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter(emp => emp.status === 'active').length;
    const totalDepartments = new Set(employees.map(emp => emp.department)).size;
    const averageSalary = employees.length > 0 
      ? employees.reduce((sum, emp) => sum + emp.salary, 0) / employees.length 
      : 0;

    return {
      totalEmployees,
      activeEmployees,
      totalDepartments,
      averageSalary
    };
  });

  departments = computed(() => {
    const employees = this.employees();
    const deptMap = new Map<string, { count: number; totalSalary: number }>();
    
    employees.forEach((emp: Employee) => {
      if (!deptMap.has(emp.department)) {
        deptMap.set(emp.department, { count: 0, totalSalary: 0 });
      }
      const dept = deptMap.get(emp.department)!;
      dept.count++;
      dept.totalSalary += emp.salary;
    });

    return Array.from(deptMap.entries()).map(([name, data]) => ({
      name,
      count: data.count,
      averageSalary: data.totalSalary / data.count
    }));
  });

  navigateToEmployees(): void {
    this.router.navigate(['/admin/employees']);
  }
}
