import { Component, inject, OnInit, signal, computed } from '@angular/core';
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
export class DashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly employeeService = inject(EmployeeService);
  private readonly router = inject(Router);

  currentUser = this.authService.currentUser;
  isLoading = signal(true);
  employees = signal<Employee[]>([]);
  currentDate = new Date();

  // Computed dashboard data
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

  // Computed departments data
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

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.isLoading.set(true);
    this.employeeService.getAllEmployees().subscribe({
      next: (employees) => {
        this.employees.set(employees);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading employees:', error);
        this.isLoading.set(false);
      }
    });
  }

  navigateToEmployees(): void {
    this.router.navigate(['/admin/employees']);
  }
}
