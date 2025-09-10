import { inject, Injectable, signal, computed } from '@angular/core';

import { Employee, CreateEmployeeRequest, UpdateEmployeeRequest } from '../models';
import { MockDataService } from './mock-data.service';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly EMPLOYEES_KEY = 'employees_data';
  
  // Signals for reactive state management
  private employeesSignal = signal<Employee[]>([]);
  private isLoadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);
  
  // Public readonly signals
  public readonly employees = this.employeesSignal.asReadonly();
  public readonly employeeCount = computed(() => this.employees().length);
  public readonly hasEmployees = computed(() => this.employees().length > 0);
  public readonly isLoading = this.isLoadingSignal.asReadonly();
  public readonly error = this.errorSignal.asReadonly();
  
  // Computed queries
  public readonly activeEmployees = computed(() => 
    this.employees().filter(emp => emp.status === 'active')
  );
  public readonly departments = computed(() => {
    const depts = this.employees().map(emp => emp.department);
    return [...new Set(depts)].sort();
  });

  private readonly localStorageService = inject(LocalStorageService);
  private readonly mockDataService = inject(MockDataService);

  constructor() {
    this.initializeEmployees();
  }

  private initializeEmployees(): void {
    let employees = this.localStorageService.getItem<Employee[]>(this.EMPLOYEES_KEY);
    
    if (!employees || employees.length === 0) {
      employees = this.mockDataService.getMockEmployees();
      this.saveEmployeesToStorage(employees);
    }

    this.employeesSignal.set(employees);
  }

  private saveEmployeesToStorage(employees: Employee[]): void {
    this.localStorageService.setItem(this.EMPLOYEES_KEY, employees);
  }

  getEmployeeById(id: string): Employee | null {
    return this.employees().find(emp => emp.id === id) || null;
  }

  searchEmployees(searchTerm: string): Employee[] {
    if (!searchTerm.trim()) return this.employees();
    
    const term = searchTerm.toLowerCase();
    return this.employees().filter(emp => 
      emp.fullName.toLowerCase().includes(term) ||
      emp.email.toLowerCase().includes(term) ||
      emp.position.toLowerCase().includes(term) ||
      emp.department.toLowerCase().includes(term)
    );
  }

  getEmployeesByDepartment(department: string): Employee[] {
    if (department === 'all') return this.employees();
    return this.employees().filter(emp => emp.department === department);
  }

  async createEmployee(employeeData: CreateEmployeeRequest): Promise<Employee> {
    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const currentEmployees = this.employees();
      
      const emailExists = currentEmployees.some(emp => emp.email === employeeData.email);
      if (emailExists) {
        throw new Error('Email already exists in the system');
      }

      const newEmployee: Employee = {
        id: this.generateId(),
        ...employeeData,
        status: 'active'
      };

      const updatedEmployees = [...currentEmployees, newEmployee];
      this.employeesSignal.set(updatedEmployees);
      this.saveEmployeesToStorage(updatedEmployees);

      return newEmployee;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create employee';
      this.errorSignal.set(errorMessage);
      throw error;
    } finally {
      this.isLoadingSignal.set(false);
    }
  }

  async updateEmployee(employeeData: UpdateEmployeeRequest): Promise<Employee> {
    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const currentEmployees = this.employees();
      const index = currentEmployees.findIndex(emp => emp.id === employeeData.id);
      
      if (index === -1) {
        throw new Error('Employee not found');
      }

      if (employeeData.email) {
        const emailExists = currentEmployees.some(
          emp => emp.email === employeeData.email && emp.id !== employeeData.id
        );
        if (emailExists) {
          throw new Error('Email already exists in the system');
        }
      }

      const updatedEmployee: Employee = {
        ...currentEmployees[index],
        ...employeeData
      };

      const updatedEmployees = [...currentEmployees];
      updatedEmployees[index] = updatedEmployee;

      this.employeesSignal.set(updatedEmployees);
      this.saveEmployeesToStorage(updatedEmployees);

      return updatedEmployee;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update employee';
      this.errorSignal.set(errorMessage);
      throw error;
    } finally {
      this.isLoadingSignal.set(false);
    }
  }

  async deleteEmployee(id: string): Promise<boolean> {
    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const currentEmployees = this.employees();
      const filteredEmployees = currentEmployees.filter(emp => emp.id !== id);
      
      if (filteredEmployees.length === currentEmployees.length) {
        throw new Error('Employee not found');
      }

      this.employeesSignal.set(filteredEmployees);
      this.saveEmployeesToStorage(filteredEmployees);

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete employee';
      this.errorSignal.set(errorMessage);
      throw error;
    } finally {
      this.isLoadingSignal.set(false);
    }
  }

  // Utility methods
  clearError(): void {
    this.errorSignal.set(null);
  }

  refreshEmployees(): void {
    this.initializeEmployees();
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}