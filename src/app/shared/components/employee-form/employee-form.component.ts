import { Component, input, output, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Employee } from '../../../core/models';

export interface EmployeeFormData {
  fullName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  salary: number;
  status: 'active' | 'inactive';
}

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css'
})
export class EmployeeFormComponent implements OnInit {
  mode = input<'add' | 'edit'>('add');
  employee = input<Employee | null>(null);
  isSubmitting = input<boolean>(false);

  formData = signal<EmployeeFormData>({
    fullName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    salary: 0,
    status: 'active'
  });

  formSubmit = output<EmployeeFormData>();
  formCancel = output<void>();

  ngOnInit(): void {
    const emp = this.employee();
    if (emp && this.mode() === 'edit') {
      this.formData.set({
        fullName: emp.fullName,
        email: emp.email,
        phone: emp.phone,
        position: emp.position,
        department: emp.department,
        salary: emp.salary,
        status: emp.status
      });
    }
  }

  onSubmit(): void {
    if (!this.isSubmitting()) {
      this.formSubmit.emit(this.formData());
    }
  }

  onCancel(): void {
    this.formCancel.emit();
  }
}
