export interface Employee {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  salary: number;
  startDate: Date;
  status: 'active' | 'inactive';
  avatar?: string;
}

export interface CreateEmployeeRequest {
  fullName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  salary: number;
  startDate: Date;
}

export interface UpdateEmployeeRequest extends Partial<CreateEmployeeRequest> {
  id: string;
  status?: 'active' | 'inactive';
}
