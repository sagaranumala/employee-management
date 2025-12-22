"use client";

import React, { useState } from "react";
import { TextField, Button, MenuItem } from "@mui/material";

// Define types for form data
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

// Example department list (replace with API fetch)
const departments = [
  { id: "01KD0XGHXYGJRJKZZSC2BH7ZSB", name: "IT" },
  { id: "01KD0XGHXYGJRJKZZSC2BH7ZSC", name: "HR" },
];

interface CreateEmployeeProps {
  onSubmit: (data: EmployeeFormData) => void;
}

export default function CreateEmployee({ onSubmit }: CreateEmployeeProps) {
  const [formData, setFormData] = useState<EmployeeFormData>({
    user: {
      name: "",
      email: "",
      phone: "",
      role: "employee",
      status: 1,
    },
    employee: {
      designation: "",
      departmentId: "",
      status: 1,
    },
    address: {
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    },
  });

  const handleChange = (section: keyof EmployeeFormData, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <div className="max-w-3xl mx-auto mt-6 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Create Employee</h2>

      {/* User Section */}
      <h3 className="text-lg font-medium mt-4 mb-2">User Details</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField
          label="Name"
          fullWidth
          value={formData.user.name}
          onChange={(e) => handleChange("user", "name", e.target.value)}
        />
        <TextField
          label="Email"
          fullWidth
          value={formData.user.email}
          onChange={(e) => handleChange("user", "email", e.target.value)}
        />
        <TextField
          label="Phone"
          fullWidth
          value={formData.user.phone}
          onChange={(e) => handleChange("user", "phone", e.target.value)}
        />
      </div>

      {/* Employee Section */}
      <h3 className="text-lg font-medium mt-6 mb-2">Employee Details</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField
          label="Designation"
          fullWidth
          value={formData.employee.designation}
          onChange={(e) => handleChange("employee", "designation", e.target.value)}
        />
        <TextField
          select
          label="Department"
          fullWidth
          value={formData.employee.departmentId}
          onChange={(e) => handleChange("employee", "departmentId", e.target.value)}
        >
          {departments.map((dept) => (
            <MenuItem key={dept.id} value={dept.id}>
              {dept.name}
            </MenuItem>
          ))}
        </TextField>
      </div>

      {/* Address Section */}
      <h3 className="text-lg font-medium mt-6 mb-2">Address Details</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField
          label="Address Line 1"
          fullWidth
          value={formData.address.addressLine1}
          onChange={(e) => handleChange("address", "addressLine1", e.target.value)}
        />
        <TextField
          label="Address Line 2"
          fullWidth
          value={formData.address.addressLine2}
          onChange={(e) => handleChange("address", "addressLine2", e.target.value)}
        />
        <TextField
          label="City"
          fullWidth
          value={formData.address.city}
          onChange={(e) => handleChange("address", "city", e.target.value)}
        />
        <TextField
          label="Country"
          fullWidth
          value={formData.address.country}
          onChange={(e) => handleChange("address", "country", e.target.value)}
        />
      </div>

      <div className="mt-6">
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Create Employee
        </Button>
      </div>
    </div>
  );
}
