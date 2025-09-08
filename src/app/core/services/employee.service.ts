import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

import { Employee, CreateEmployeeRequest, UpdateEmployeeRequest } from '../models';
import { MockDataService } from './mock-data.service';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly EMPLOYEES_KEY = 'employees_data';
  
  private employeesSubject = new BehaviorSubject<Employee[]>([]);
  public employees$ = this.employeesSubject.asObservable();

  private localStorageService = inject(LocalStorageService);
  private mockDataService = inject(MockDataService);

  constructor() {
    this.initializeEmployees();
  }

  private initializeEmployees(): void {
    let employees = this.localStorageService.getItem<Employee[]>(this.EMPLOYEES_KEY);
    
    if (!employees || employees.length === 0) {
      employees = this.mockDataService.getMockEmployees();
      this.saveEmployeesToStorage(employees);
    }

    this.employeesSubject.next(employees);
  }

  private saveEmployeesToStorage(employees: Employee[]): void {
    this.localStorageService.setItem(this.EMPLOYEES_KEY, employees);
  }

  getAllEmployees(): Observable<Employee[]> {
    return this.employees$.pipe(delay(300));
  }

  getEmployeeById(id: string): Observable<Employee | null> {
    return this.employees$.pipe(
      delay(200),
      map(employees => employees.find(emp => emp.id === id) || null)
    );
  }

  createEmployee(employeeData: CreateEmployeeRequest): Observable<Employee> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const currentEmployees = this.employeesSubject.value;
        
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
        this.employeesSubject.next(updatedEmployees);
        this.saveEmployeesToStorage(updatedEmployees);

        return newEmployee;
      })
    );
  }

  updateEmployee(employeeData: UpdateEmployeeRequest): Observable<Employee> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const currentEmployees = this.employeesSubject.value;
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

        this.employeesSubject.next(updatedEmployees);
        this.saveEmployeesToStorage(updatedEmployees);

        return updatedEmployee;
      })
    );
  }

  deleteEmployee(id: string): Observable<boolean> {
    return of(null).pipe(
      delay(300),
      map(() => {
        const currentEmployees = this.employeesSubject.value;
        const filteredEmployees = currentEmployees.filter(emp => emp.id !== id);
        
        if (filteredEmployees.length === currentEmployees.length) {
          throw new Error('Employee not found');
        }

        this.employeesSubject.next(filteredEmployees);
        this.saveEmployeesToStorage(filteredEmployees);

        return true;
      })
    );
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}