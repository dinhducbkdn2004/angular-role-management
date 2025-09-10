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

  // Use signals directly from service
  employees = this.employeeService.employees;
  isLoading = this.employeeService.isLoading;
  error = this.employeeService.error;
  
  // Component-specific signals
  filteredEmployees = signal<Employee[]>([]);
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
    this.filteredEmployees.set(this.employees());
  }

  onSearch(): void {
    const filtered = this.employeeService.searchEmployees(this.searchTerm());
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

  async deleteEmployee(employee: Employee): Promise<void> {
    if (confirm(`Are you sure you want to delete ${employee.fullName}?`)) {
      try {
        await this.employeeService.deleteEmployee(employee.id);
        this.selectedEmployee.set(null);
        this.filteredEmployees.set(this.employees()); // Refresh filtered list
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert('Failed to delete employee. Please try again.');
      }
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

  async saveEmployee(): Promise<void> {
    try {
      if (this.showEditForm()) {
        // Update existing employee
        const updateData = {
          ...this.newEmployee as Employee,
          id: this.selectedEmployee()!.id
        };
        
        await this.employeeService.updateEmployee(updateData);
        this.showEditForm.set(false);
        this.selectedEmployee.set(null);
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
        
        await this.employeeService.createEmployee(createData);
        this.showAddForm.set(false);
        this.selectedEmployee.set(null);
      }
      
      // Refresh filtered list
      this.filteredEmployees.set(this.employees());
    } catch (error) {
      console.error('Error saving employee:', error);
      alert('Failed to save employee. Please try again.');
    }
  }

  cancelForm(): void {
    this.showAddForm.set(false);
    this.showEditForm.set(false);
    this.selectedEmployee.set(null);
  }
}
