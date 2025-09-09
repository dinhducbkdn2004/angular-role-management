import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule, Users, Search, Eye, Phone, Mail, Calendar } from 'lucide-angular';

import { EmployeeService } from '../../../core';
import { Employee } from '../../../core/models';
import { LoadingComponent } from '../../../shared/components';
import { InitialsPipe } from '../../../shared/pipes';

@Component({
  selector: 'app-user-employees',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, LoadingComponent, InitialsPipe],
  templateUrl: './user-employees.component.html',
  styleUrl: './user-employees.component.css'
})
export class UserEmployeesComponent implements OnInit {
  // Lucide icons
  readonly Users = Users;
  readonly Search = Search;
  readonly Eye = Eye;
  readonly Phone = Phone;
  readonly Mail = Mail;
  readonly Calendar = Calendar;

  // Services
  private employeeService = inject(EmployeeService);
  private router = inject(Router);

  // Signals
  isLoading = signal(false);
  searchTerm = signal('');
  selectedDepartment = signal('all');

  // Data
  employees = this.employeeService.employees;

  // Computed properties
  filteredEmployees = computed(() => {
    let filtered = this.employees();
    
    // Filter by search term
    const search = this.searchTerm().toLowerCase();
    if (search) {
      filtered = filtered.filter(emp => 
        emp.fullName.toLowerCase().includes(search) ||
        emp.email.toLowerCase().includes(search) ||
        emp.position.toLowerCase().includes(search) ||
        emp.department.toLowerCase().includes(search)
      );
    }

    // Filter by department
    const dept = this.selectedDepartment();
    if (dept !== 'all') {
      filtered = filtered.filter(emp => emp.department === dept);
    }

    return filtered;
  });

  departments = computed(() => {
    const allDepartments = this.employees().map(emp => emp.department);
    return [...new Set(allDepartments)].sort();
  });

  employeeStats = computed(() => {
    const employees = this.employees();
    const activeEmployees = employees.filter(emp => emp.status === 'active');
    
    return {
      total: employees.length,
      active: activeEmployees.length,
      departments: this.departments().length
    };
  });

  ngOnInit() {
    this.loadEmployees();
  }

  private async loadEmployees() {
    this.isLoading.set(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
    } finally {
      this.isLoading.set(false);
    }
  }

  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
  }

  onDepartmentChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedDepartment.set(target.value);
  }

  viewEmployee(employee: Employee) {
    console.log('Viewing employee:', employee);
  }

  getStatusClass(status: string): string {
    return status === 'active' ? 'status-active' : 'status-inactive';
  }
}
