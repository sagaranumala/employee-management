export interface Employee {
    employeeId: string;
    designation: string;
    status: number;
    createdAt: string; // or Date if you parse it
    userId: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    departmentId: string;
    departmentName: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
}

export interface Department {
  departmentId: string;
  name: string;
}

export interface EmployeeFormData {
  user: {
    name: string;
    email: string;
    phone: string;
    role: string;
    status: number;
  };
  employee: {
    designation: string;
    departmentId: string;
    status: number;
  };
  address: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state?: string;
    country: string;
    postalCode?: string;
  };
}