"use client";

import React, { useState } from "react";
import ReusableTable, { Column } from "../components/table";
import { TextField, Button, MenuItem } from "@mui/material";

// Types
interface Employee {
  employeeId: string;
  designation: string;
  status: number;
  createdAt: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  departmentId: string;
  departmentName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
}

interface EmployeeFormData {
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

// Example department list
const departments = [
  { id: "01KD0XGHXYGJRJKZZSC2BH7ZSB", name: "IT" },
  { id: "01KD0XGHXYGJRJKZZSC2BH7ZSC", name: "HR" },
];

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Form state
  const [formData, setFormData] = useState<EmployeeFormData>({
    user: { name: "", email: "", phone: "", role: "employee", status: 1 },
    employee: { designation: "", departmentId: "", status: 1 },
    address: { addressLine1: "", addressLine2: "", city: "", state: "", country: "", postalCode: "" },
  });

  const handleChange = (section: keyof EmployeeFormData, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handleSubmit = () => {
    const newEmployee: Employee = {
      employeeId: "EMP" + Date.now(), // temporary id
      createdAt: new Date().toISOString(),
      userId: "USER" + Date.now(),
      name: formData.user.name,
      email: formData.user.email,
      phone: formData.user.phone,
      role: formData.user.role,
      status: formData.user.status,
      designation: formData.employee.designation,
      departmentId: formData.employee.departmentId,
      departmentName: departments.find((d) => d.id === formData.employee.departmentId)?.name || "",
      addressLine1: formData.address.addressLine1,
      addressLine2: formData.address.addressLine2,
      city: formData.address.city,
      state: formData.address.state,
      country: formData.address.country,
      postalCode: formData.address.postalCode,
    };

    setEmployees((prev) => [...prev, newEmployee]);

    // Reset form
    setFormData({
      user: { name: "", email: "", phone: "", role: "employee", status: 1 },
      employee: { designation: "", departmentId: "", status: 1 },
      address: { addressLine1: "", addressLine2: "", city: "", state: "", country: "", postalCode: "" },
    });
  };

  // Columns for ReusableTable
  const columns: Column<Employee>[] = [
    { field: "name", headerName: "Name" },
    { field: "email", headerName: "Email" },
    { field: "phone", headerName: "Phone" },
    { field: "designation", headerName: "Designation" },
    { field: "departmentName", headerName: "Department" },
    { field: "city", headerName: "City" },
    { field: "country", headerName: "Country" },
    { field: "status", headerName: "Status", render: (row) => (row.status === 1 ? "Active" : "Inactive") },
  ];

  return (
    <div className="max-w-6xl mx-auto mt-6">
      {/* Create Employee Form */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Create Employee</h2>

        {/* User Section */}
        <h3 className="font-medium mb-2">User Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField label="Name" fullWidth value={formData.user.name} onChange={(e) => handleChange("user", "name", e.target.value)} />
          <TextField label="Email" fullWidth value={formData.user.email} onChange={(e) => handleChange("user", "email", e.target.value)} />
          <TextField label="Phone" fullWidth value={formData.user.phone} onChange={(e) => handleChange("user", "phone", e.target.value)} />
        </div>

        {/* Employee Section */}
        <h3 className="font-medium mt-6 mb-2">Employee Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField label="Designation" fullWidth value={formData.employee.designation} onChange={(e) => handleChange("employee", "designation", e.target.value)} />
          <TextField select label="Department" fullWidth value={formData.employee.departmentId} onChange={(e) => handleChange("employee", "departmentId", e.target.value)}>
            {departments.map((dept) => <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>)}
          </TextField>
        </div>

        {/* Address Section */}
        <h3 className="font-medium mt-6 mb-2">Address Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField label="Address Line 1" fullWidth value={formData.address.addressLine1} onChange={(e) => handleChange("address", "addressLine1", e.target.value)} />
          <TextField label="Address Line 2" fullWidth value={formData.address.addressLine2} onChange={(e) => handleChange("address", "addressLine2", e.target.value)} />
          <TextField label="City" fullWidth value={formData.address.city} onChange={(e) => handleChange("address", "city", e.target.value)} />
          <TextField label="Country" fullWidth value={formData.address.country} onChange={(e) => handleChange("address", "country", e.target.value)} />
        </div>

        <Button variant="contained" color="primary" className="mt-6" onClick={handleSubmit}>
          Create Employee
        </Button>
      </div>

      {/* Employee Table */}
      <ReusableTable columns={columns} data={employees} defaultRowsPerPage={5} />
    </div>
  );
}
