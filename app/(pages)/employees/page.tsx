// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import ReusableTable, { Column } from "../components/table";
// import { TextField, Button, MenuItem } from "@mui/material";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { api } from "@/src/lib/api";

// interface Department {
//   departmentId: string;
//   name: string;
// }

// interface Employee {
//   employeeId: string;
//   designation: string;
//   status: number;
//   createdAt: string;
//   name: string;
//   email: string;
//   phone: string;
//   role: string;
//   departmentId: string;
//   departmentName: string;
//   addressLine1: string;
//   addressLine2?: string;
//   city: string;
//   state?: string;
//   country: string;
//   postalCode?: string;
// }

// interface EmployeeFormData {
//   user: { name: string; email: string; phone: string; role: string; status: number };
//   employee: { name: string; designation: string; departmentId: string; status: number };
//   address: { addressLine1: string; addressLine2?: string; city: string; state?: string; country: string; postalCode?: string };
// }

// export default function EmployeeManagement() {
//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [departments, setDepartments] = useState<Department[]>([]);
//   const [formData, setFormData] = useState<EmployeeFormData>({
//     user: { name: "", email: "", phone: "", role: "employee", status: 1 },
//     employee: { name: "", designation: "", departmentId: "", status: 1 },
//     address: { addressLine1: "", addressLine2: "", city: "", state: "", country: "", postalCode: "" },
//   });
//   const [editingEmployeeId, setEditingEmployeeId] = useState<string | null>(null);
//   const [highlightId, setHighlightId] = useState<string | null>(null);
//   const tableRef = useRef<HTMLDivElement>(null);

//   const fetchEmployees = async () => {
//     try {
//       const data = await api<{ success: boolean; employees: Employee[] }>("employee/index");
//       if (data.success) setEmployees(data.employees);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to fetch employees");
//     }
//   };

//   const fetchDepartments = async () => {
//     try {
//       const data = await api<{ success: boolean; departments: Department[] }>("department/index");
//       if (data.success) setDepartments(data.departments);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to fetch departments");
//     }
//   };

//   useEffect(() => {
//     fetchEmployees();
//     fetchDepartments();
//   }, []);

//   const handleChange = (section: keyof EmployeeFormData, field: string, value: any) => {
//     setFormData((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
//   };

//   // Inside EmployeeManagement.tsx

// const handleSubmit = async () => {
//   try {
//     const url = editingEmployeeId ? `employee/update?id=${editingEmployeeId}` : "employee/create";
//     const method = editingEmployeeId ? "PUT" : "POST";
//     const res = await api(url, { method, body: formData });
//     if (res.success) {
//       toast.success(`Employee ${editingEmployeeId ? "updated" : "created"} successfully`);
//       fetchEmployees();

//       const newId = res.data?.employeeId ?? null;
//       if (newId) {
//         setHighlightId(newId); // Highlight new/updated employee
//         setTimeout(() => setHighlightId(null), 3000); // Remove highlight after 3s
//         setTimeout(() => {
//           const el = document.getElementById(`row-${newId}`);
//           el?.scrollIntoView({ behavior: "smooth", block: "center" });
//         }, 300);
//       }

//       setEditingEmployeeId(null);
//       setFormData({
//         user: { name: "", email: "", phone: "", role: "employee", status: 1 },
//         employee: { name: "", designation: "", departmentId: "", status: 1 },
//         address: { addressLine1: "", addressLine2: "", city: "", state: "", country: "", postalCode: "" },
//       });
//     } else {
//       toast.error(res.message || "Operation failed");
//     }
//   } catch (err: any) {
//     console.error(err);
//     toast.error(err.message || "Something went wrong");
//   }
// };


//   const handleEdit = (emp: Employee) => {
//     setEditingEmployeeId(emp.employeeId);
//     setFormData({
//       user: { name: emp.name, email: emp.email, phone: emp.phone, role: emp.role, status: emp.status },
//       employee: { name: emp.name, designation: emp.designation, departmentId: emp.departmentId, status: emp.status },
//       address: { addressLine1: emp.addressLine1, addressLine2: emp.addressLine2, city: emp.city, state: emp.state, country: emp.country, postalCode: emp.postalCode },
//     });
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const handleDelete = async (emp: Employee) => {
//     if (!confirm(`Delete employee ${emp.name}?`)) return;
//     try {
//       const res = await api(`employee/delete?id=${emp.employeeId}`, { method: "DELETE" });
//       if (res.success) {
//         toast.success("Employee deleted successfully");
//         fetchEmployees();
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to delete employee");
//     }
//   };

//   const columns: Column<Employee>[] = [
//     { field: "name", headerName: "Name" },
//     { field: "email", headerName: "Email" },
//     { field: "phone", headerName: "Phone" },
//     { field: "designation", headerName: "Designation" },
//     { field: "departmentName", headerName: "Department" },
//     { field: "city", headerName: "City" },
//     { field: "state", headerName: "State" },
//     { field: "country", headerName: "Country" },
//     { field: "addressLine1", headerName: "Address 1" },
//     { field: "addressLine2", headerName: "Address 2" },
//     { field: "postalCode", headerName: "Postal Code" },
//     { field: "status", headerName: "Status", render: (row) => (row.status === 1 ? "Active" : "Inactive") },
//   ];

//   return (
//     <div className="max-w-6xl mx-auto mt-6">
//       <ToastContainer position="top-right" autoClose={3000} />
//       {/* Button to open popup */}
//       <Button
//         className="mb-4"
//         variant="contained"
//         color="primary"
//         onClick={() => setEditingEmployeeId("new")}
//       >
//         Add Employee
//       </Button>

//       {/* Popup Form */}
//       {editingEmployeeId && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded shadow-lg w-full max-w-3xl p-6 relative">
//             <button
//               className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
//               onClick={() => setEditingEmployeeId(null)}
//             >
//               ✕
//             </button>
//             <h2 className="text-xl font-semibold mb-4">{editingEmployeeId === "new" ? "Create Employee" : "Edit Employee"}</h2>
            
//             {/* Form Fields */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <TextField label="Name" fullWidth value={formData.user.name} onChange={(e) => setFormData({...formData, user:{...formData.user,name:e.target.value}})} />
//               <TextField label="Email" fullWidth value={formData.user.email} onChange={(e) => setFormData({...formData, user:{...formData.user,email:e.target.value}})} />
//               <TextField label="Phone" fullWidth value={formData.user.phone} onChange={(e) => setFormData({...formData, user:{...formData.user,phone:e.target.value}})} />
//               <TextField label="Designation" fullWidth value={formData.employee.designation} onChange={(e) => setFormData({...formData, employee:{...formData.employee,designation:e.target.value}})} />
//               <TextField select label="Department" fullWidth value={formData.employee.departmentId} onChange={(e) => setFormData({...formData, employee:{...formData.employee,departmentId:e.target.value}})}>
//                 {departments.map(d => <MenuItem key={d.departmentId} value={d.departmentId}>{d.name}</MenuItem>)}
//               </TextField>
//               <TextField label="Address Line 1" fullWidth value={formData.address.addressLine1} onChange={(e) => setFormData({...formData, address:{...formData.address,addressLine1:e.target.value}})} />
//               <TextField label="Address Line 2" fullWidth value={formData.address.addressLine2} onChange={(e) => setFormData({...formData, address:{...formData.address,addressLine2:e.target.value}})} />
//               <TextField label="City" fullWidth value={formData.address.city} onChange={(e) => setFormData({...formData, address:{...formData.address,city:e.target.value}})} />
//               <TextField label="State" fullWidth value={formData.address.state} onChange={(e) => setFormData({...formData, address:{...formData.address,state:e.target.value}})} />
//               <TextField label="Country" fullWidth value={formData.address.country} onChange={(e) => setFormData({...formData, address:{...formData.address,country:e.target.value}})} />
//               <TextField label="Postal Code" fullWidth value={formData.address.postalCode} onChange={(e) => setFormData({...formData, address:{...formData.address,postalCode:e.target.value}})} />
//             </div>

//             <Button className="mt-6" variant="contained" color="primary" onClick={handleSubmit}>
//               {editingEmployeeId === "new" ? "Create" : "Update"}
//             </Button>
//           </div>
//         </div>
//       )}

//       {/* Employee Table */}
//       <ReusableTable columns={columns} data={employees.map(emp => ({ ...emp, employeeId: emp.employeeId }))} 
//         onEdit={handleEdit} onDelete={handleDelete} highlightRowId={highlightId} />
//     </div>
//   );
// }



"use client";

import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { api } from "@/src/lib/api";
import EmployeeForm from "./components/EmployeeForm";
import ReusableTable from "../components/table3";
import { Employee, EmployeeFormData } from "../types/types";
import { Chip } from "@mui/material";

interface Department {
  departmentId: string;
  name: string;
}

// interface Employee {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   designation: string;
//   departmentId: string;
//   departmentName: string;
// }


export default function EmployeeManagement() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [highlightId, setHighlightId] = useState<string | null>(null);

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  const fetchEmployees = async () => {
    try {
      const data = await api<{ success: boolean; employees: Employee[] }>("employee/index");
      if (data.success) setEmployees(data.employees);
    } catch (err) {
      toast.error("Failed to fetch employees");
    }
  };

  const fetchDepartments = async () => {
    try {
      const data = await api<{ success: boolean; departments: Department[] }>("department/index");
      if (data.success) setDepartments(data.departments);
    } catch (err) {
      toast.error("Failed to fetch departments");
    }
  };

  const handleAdd = async (item: Employee) => {
    try {
      const res = await api("employee/create", { method: "POST", body: item });
      if (res.success) {
        toast.success("Employee created successfully");
        fetchEmployees();
        setHighlightId(res.data.id);
      } else {
        toast.error(res.message || "Failed to create employee");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
  };

  const handleEdit = async (item: EmployeeFormData & { employeeId: string }) => {
    try {
      const res = await api(`employee/update&employeeId=${item.employeeId}`, { method: "POST", body: item });
      if (res.success) {
        toast.success("Employee updated successfully");
        fetchEmployees();
        setHighlightId(item.id);
      } else {
        toast.error(res.message || "Failed to update employee");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
  };

 const handleDelete = async (item: Employee) => {
  if (!confirm(`Delete employee ${item.name}?`)) return;

  try {
    const res = await api("employee/deactivate", {
      method: "POST",
      body: {
        employeeId: item.employeeId,
      },
    });

    if (res.success) {
      toast.success("Employee deactivated successfully");
      fetchEmployees();
    } else {
      toast.error(res.message || "Failed to deactivate employee");
    }
  } catch (err) {
    toast.error("Failed to delete employee");
  }
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
    render: (row) =>
      new Date(row.createdAt).toLocaleDateString(),
  },
];


  return (
    <div className="max-w-6xl mx-auto mt-6">
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

// customEditForm={(row, onSave) => (
//   <EmployeeForm initialData={row} departments={departments} onSubmit={onSave} />
// )}
      />
    </div>
  );
}
