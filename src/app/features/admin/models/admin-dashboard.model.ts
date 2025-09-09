export interface AdminStats {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  totalDepartments: number;
  averageSalary: number;
  newEmployeesThisMonth: number;
}

export interface DashboardCard {
  title: string;
  value: string | number;
  icon: string;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  description: string;
}
