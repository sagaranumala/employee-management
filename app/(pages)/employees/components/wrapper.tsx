"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle, Button, DialogActions } from "@mui/material";
import ReusableTable from "../../components/table2";
import CreateEmployee from "./createEmployee";

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  department: string;
  status: string;
}

interface EmployeeTableWrapperProps {
  employees: Employee[];
  onAdd?: (item: Employee) => void;
  onEdit?: (item: Employee) => void;
  onDelete?: (item: Employee) => void;
}

export default function EmployeeTableWrapper({
  employees,
  onAdd,
  onEdit,
  onDelete,
}: EmployeeTableWrapperProps) {
  const [openForm, setOpenForm] = useState(false);

  const employeeColumns = [
    { field: 'name', headerName: 'Name' },
    { field: 'email', headerName: 'Email' },
    { field: 'phone', headerName: 'Phone' },
    { field: 'designation', headerName: 'Designation' },
    { field: 'department', headerName: 'Department' },
    { field: 'status', headerName: 'Status' },
  ];

  // Departments data (should match CreateEmployee component)
  const departments = [
    { id: "01KD0XGHXYGJRJKZZSC2BH7ZSB", name: "IT" },
    { id: "01KD0XGHXYGJRJKZZSC2BH7ZSC", name: "HR" },
  ];

  const handleEmployeeSubmit = (formData: EmployeeFormData) => {
    // Transform form data to employee object
    const departmentName = departments.find(d => d.id === formData.employee.departmentId)?.name || 'N/A';
    
    const newEmployee: Employee = {
      id: Date.now().toString(),
      name: formData.user.name,
      email: formData.user.email,
      phone: formData.user.phone,
      designation: formData.employee.designation,
      department: departmentName,
      status: formData.user.status === 1 ? 'Active' : 'Inactive',
    };
    
    // Call the parent's onAdd handler
    if (onAdd) {
      onAdd(newEmployee);
    } else {
      console.log("Add employee:", newEmployee);
    }
    
    setOpenForm(false);
  };

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  return (
    <>
      <ReusableTable<Employee>
        columns={employeeColumns}
        data={employees}
        onAdd={handleOpenForm} // Custom handler to open the employee form
        onEdit={onEdit}
        onDelete={onDelete}
      />
      
      {/* Employee Form Popup Dialog */}
      <Dialog 
        open={openForm} 
        onClose={handleCloseForm}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle>Create New Employee</DialogTitle>
        <DialogContent dividers>
          <CreateEmployee onSubmit={handleEmployeeSubmit} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}