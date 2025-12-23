"use client";

import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { api } from "@/src/lib/api";
import EmployeeForm from "./components/EmployeeForm";
import ReusableTable from "../components/table3";
import { Employee, EmployeeFormData } from "../types/types";
import { Chip } from "@mui/material";
import { handleCreate, handleDeactivate, updateEmployee } from "./action";
import { useAuth } from "@/src/auth/AuthContext";

interface Department {
  departmentId: string;
  name: string;
}

export default function EmployeeManagement() {
  const { user, loading } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [highlightId, setHighlightId] = useState<string | null>(null);

  // Always call hooks
  useEffect(() => {
    if (user?.role === "admin") {
      fetchEmployees();
      fetchDepartments();
    }
  }, [user]); // dependency on user

  const fetchEmployees = async () => {
    try {
      const data = await api<{ success: boolean; employees: Employee[] }>(
        "employee/index"
      );
      if (data.success) setEmployees(data.employees);
    } catch (err) {
      toast.error("Failed to fetch employees");
    }
  };

  const fetchDepartments = async () => {
    try {
      const data = await api<{ success: boolean; departments: Department[] }>(
        "department/index"
      );
      if (data.success) setDepartments(data.departments);
    } catch (err) {
      toast.error("Failed to fetch departments");
    }
  };

  const handleEdit = async (item: EmployeeFormData) => {
    await updateEmployee(
      item.employeeId,
      { user: item.user, employee: item.employee, address: item.address },
      fetchEmployees
    );
  };

  const handleAdd = async (item: Employee) => {
    await handleCreate(item, fetchEmployees);
  };

  const handleDelete = async (item: Employee) => {
    await handleDeactivate(item, fetchEmployees);
  };

  const columns = [
    { field: "employeeId", headerName: "Employee ID" },
    { field: "name", headerName: "Name" },
    { field: "email", headerName: "Email" },
    { field: "phone", headerName: "Phone" },
    { field: "role", headerName: "Role" },
    {
      field: "status",
      headerName: "Status",
      render: (row) => (
        <Chip
          label={row.status === 1 ? "Active" : "Inactive"}
          size="small"
          sx={{
            fontWeight: 600,
            color: row.status === 1 ? "success.dark" : "error.dark",
            backgroundColor:
              row.status === 1 ? "success.light" : "error.light",
          }}
        />
      ),
    },
    { field: "designation", headerName: "Designation" },
    { field: "departmentName", headerName: "Department" },
    { field: "addressLine1", headerName: "Address Line 1" },
    { field: "addressLine2", headerName: "Address Line 2" },
    { field: "city", headerName: "City" },
    { field: "state", headerName: "State" },
    { field: "country", headerName: "Country" },
    { field: "postalCode", headerName: "Postal Code" },
    {
      field: "createdAt",
      headerName: "Created At",
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
  ];

  // Conditional render in JSX, not around hooks
  if (loading) return <div>Loading...</div>;
  if (!user || user.role !== "admin") return <div>404 Not Found</div>;

  return (
    <div className=" mx-auto mt-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <ReusableTable<Employee>
        columns={columns}
        data={employees}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        highlightRowId={highlightId}
        customForm={<EmployeeForm departments={departments} onSubmit={() => {}} />}
        customEditForm={(row, onSave) => (
          <EmployeeForm initialData={row} departments={departments} onSubmit={onSave} />
        )}
      />
    </div>
  );
}
