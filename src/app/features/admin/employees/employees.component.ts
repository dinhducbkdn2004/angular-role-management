import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EmployeeService } from '../../../core';
import { Employee } from '../../../core/models';
import { EmployeeCardComponent, LoadingComponent } from '../../../shared/components';

@Component({
  selector: 'app-employees',
  imports: [CommonModule, FormsModule, EmployeeCardComponent, LoadingComponent],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css'
})
export class EmployeesComponent implements OnInit {
  private readonly employeeService = inject(EmployeeService);

  employees = signal<Employee[]>([]);
  filteredEmployees = signal<Employee[]>([]);
  isLoading = signal(true);
  searchTerm = signal('');
  selectedEmployee = signal<Employee | null>(null);
  showAddForm = signal(false);
  showEditForm = signal(false);

  // Form data
  newEmployee: Partial<Employee> = {
    fullName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    salary: 0,
    status: 'active'
  };

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.isLoading.set(true);
    
    this.employeeService.getAllEmployees().subscribe({
      next: (employees) => {
        this.employees.set(employees);
        this.filteredEmployees.set(employees);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading employees:', error);
        this.isLoading.set(false);
      }
    });
  }

  onSearch(): void {
    const term = this.searchTerm().toLowerCase();
    if (!term) {
      this.filteredEmployees.set(this.employees());
      return;
    }

    const filtered = this.employees().filter(emp => 
      emp.fullName.toLowerCase().includes(term) ||
      emp.email.toLowerCase().includes(term) ||
      emp.position.toLowerCase().includes(term) ||
      emp.department.toLowerCase().includes(term)
    );
    this.filteredEmployees.set(filtered);
  }

  viewEmployee(employee: Employee): void {
    this.selectedEmployee.set(employee);
    this.showEditForm.set(false);
  }

  editEmployee(employee: Employee): void {
    this.selectedEmployee.set(employee);
    this.newEmployee = { ...employee };
    this.showEditForm.set(true);
  }

  deleteEmployee(employee: Employee): void {
    if (confirm(`Are you sure you want to delete ${employee.fullName}?`)) {
      this.employeeService.deleteEmployee(employee.id).subscribe({
        next: () => {
          this.loadEmployees(); // Reload to get updated data
          this.selectedEmployee.set(null);
        },
        error: (error) => {
          console.error('Error deleting employee:', error);
          alert('Failed to delete employee. Please try again.');
        }
      });
    }
  }

  showAddEmployeeForm(): void {
    this.newEmployee = {
      fullName: '',
      email: '',
      phone: '',
      position: '',
      department: '',
      salary: 0,
      status: 'active'
    };
    this.showAddForm.set(true);
    this.selectedEmployee.set(null);
  }

  saveEmployee(): void {
    if (this.showEditForm()) {
      // Update existing employee
      const updateData = {
        ...this.newEmployee as Employee,
        id: this.selectedEmployee()!.id
      };
      
      this.employeeService.updateEmployee(updateData).subscribe({
        next: () => {
          this.loadEmployees(); // Reload to get updated data
          this.showEditForm.set(false);
          this.selectedEmployee.set(null);
        },
        error: (error) => {
          console.error('Error updating employee:', error);
          alert('Failed to update employee. Please try again.');
        }
      });
    } else {
      // Add new employee
      const createData = {
        fullName: this.newEmployee.fullName!,
        email: this.newEmployee.email!,
        phone: this.newEmployee.phone!,
        position: this.newEmployee.position!,
        department: this.newEmployee.department!,
        salary: this.newEmployee.salary!,
        startDate: new Date()
      };
      
      this.employeeService.createEmployee(createData).subscribe({
        next: () => {
          this.loadEmployees(); // Reload to get updated data
          this.showAddForm.set(false);
          this.selectedEmployee.set(null);
        },
        error: (error) => {
          console.error('Error creating employee:', error);
          alert('Failed to create employee. Please try again.');
        }
      });
    }
  }

  cancelForm(): void {
    this.showAddForm.set(false);
    this.showEditForm.set(false);
    this.selectedEmployee.set(null);
  }

  formatSalary(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('vi-VN');
  }
}
