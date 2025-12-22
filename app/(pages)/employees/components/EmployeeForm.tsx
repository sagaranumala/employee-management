"use client";

import React, { useState, useEffect } from "react";
import { TextField, Button, MenuItem, Grid } from "@mui/material";
import { Department, Employee, EmployeeFormData } from "../../types/types";


interface EmployeeFormProps {
  initialData?: Employee;
  departments: Department[];
  onSubmit: (data: EmployeeFormData) => void;
}

export default function EmployeeForm({
  initialData,
  departments,
  onSubmit,
}: EmployeeFormProps) {
  // Initialize form data with initialData if provided
  const [formData, setFormData] = useState<EmployeeFormData>({
    user: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      role: initialData?.role || "employee",
      status: initialData?.status || 1,
    },
    employee: {
      designation: initialData?.designation || "",
      departmentId: initialData?.departmentId || (departments[0]?.departmentId || ""),
      status: 1,
    },
    address: {
      addressLine1: initialData?.addressLine1 || "",
      addressLine2: initialData?.addressLine2 || "",
      city: initialData?.city || "",
      state: initialData?.state || "",
      country: initialData?.country || "",
      postalCode: initialData?.postalCode || "",
    },
  });

  const handleChange = (
    section: keyof EmployeeFormData,
    field: string,
    value: any
  ) => {
    setFormData({
      ...formData,
      [section]: { ...formData[section], [field]: value },
    });
  };

  console.log("Form Data:", formData.employee.departmentId);

  return (
    <div className="p-4">
      <Grid container spacing={2}>
        {/* User Section */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Name"
            fullWidth
            value={formData.user.name}
            onChange={(e) => handleChange("user", "name", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Email"
            fullWidth
            value={formData.user.email}
            onChange={(e) => handleChange("user", "email", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Phone"
            fullWidth
            value={formData.user.phone}
            onChange={(e) => handleChange("user", "phone", e.target.value)}
          />
        </Grid>

        {/* Employee Section */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Designation"
            fullWidth
            value={formData.employee.designation}
            onChange={(e) =>
              handleChange("employee", "designation", e.target.value)
            }
          />
        </Grid>
   <Grid item xs={12} sm={6}>
  <div style={{ width: '100%' }}>
    <TextField
      select
      label="Department"
      fullWidth
      value={formData.employee.departmentId}
      onChange={(e) =>
        handleChange("employee", "departmentId", e.target.value)
      }
    >
      {departments.map((d) => (
        <MenuItem key={d.departmentId} value={d.departmentId}>
          {d.name}
        </MenuItem>
      ))}
    </TextField>
  </div>
</Grid>




        {/* Address Section */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Address Line 1"
            fullWidth
            value={formData.address.addressLine1}
            onChange={(e) =>
              handleChange("address", "addressLine1", e.target.value)
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Address Line 2"
            fullWidth
            value={formData.address.addressLine2 || ""}
            onChange={(e) =>
              handleChange("address", "addressLine2", e.target.value)
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="City"
            fullWidth
            value={formData.address.city}
            onChange={(e) => handleChange("address", "city", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="State"
            fullWidth
            value={formData.address.state || ""}
            onChange={(e) => handleChange("address", "state", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Country"
            fullWidth
            value={formData.address.country}
            onChange={(e) =>
              handleChange("address", "country", e.target.value)
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Postal Code"
            fullWidth
            value={formData.address.postalCode || ""}
            onChange={(e) =>
              handleChange("address", "postalCode", e.target.value)
            }
          />
        </Grid>
      </Grid>

      <Button
        className="mt-4"
        variant="contained"
        color="primary"
        onClick={() => onSubmit({...formData, employeeId: initialData?.employeeId})}
      >
        Save
      </Button>
    </div>
  );
}
