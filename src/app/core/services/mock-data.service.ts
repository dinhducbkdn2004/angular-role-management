import { Injectable } from '@angular/core';
import { Employee, User } from '../models';

@Injectable({ providedIn: 'root' })
export class MockDataService {
  private mockUsers: User[] = [
    {
      id: '1',
      username: 'admin',
      email: 'admin@company.com',
      role: 'admin',
      fullName: 'Admin User',
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      username: 'user',
      email: 'user@company.com',
      role: 'user',
      fullName: 'Normal User',
      createdAt: new Date('2024-01-02'),
    },
  ];

  private mockEmployees: Employee[] = [
    {
      id: '1',
      fullName: 'Nguyễn Văn An',
      email: 'an.nguyen@company.com',
      phone: '0901234567',
      position: 'Frontend Developer',
      department: 'IT',
      salary: 15000000,
      startDate: new Date('2023-01-15'),
      status: 'active',
    },
    {
      id: '2',
      fullName: 'Trần Thị Bình',
      email: 'binh.tran@company.com',
      phone: '0902345678',
      position: 'UI/UX Designer',
      department: 'Design',
      salary: 12000000,
      startDate: new Date('2023-03-20'),
      status: 'active',
    },
    {
      id: '3',
      fullName: 'Lê Văn Cường',
      email: 'cuong.le@company.com',
      phone: '0903456789',
      position: 'Backend Developer',
      department: 'IT',
      salary: 18000000,
      startDate: new Date('2022-11-10'),
      status: 'active',
    },
  ];

  getMockUsers(): User[] {
    return [...this.mockUsers];
  }

  getMockEmployees(): Employee[] {
    return [...this.mockEmployees];
  }

  findUserByCredentials(username: string, password: string): User | null {
    // Mock password: admin/admin, user/user
    const validCredentials = [
      { username: 'admin', password: 'admin' },
      { username: 'user', password: 'user' }
    ];

    const isValid = validCredentials.some(
      cred => cred.username === username && cred.password === password
    );

    if (isValid) {
      return this.mockUsers.find(user => user.username === username) || null;
    }
    
    return null;
  }
}
