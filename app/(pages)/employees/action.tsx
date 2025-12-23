// src/app/(pages)/employee/action.ts
import { api, API_BASE } from "@/src/lib/api";
import { addCsrfHeader, fetchCsrfToken, appendCsrfToFormData, getCsrfToken } from "@/src/lib/csrf";
import { Employee } from "../types/types";
import { useToast } from "../components/toast";



/**
 * Add new employee (updated to use FormData like updateEmployee)
 */
export async function handleCreate(
  item: Employee & { user?: any; employee?: any; address?: any },
  fetchEmployees: () => void
) {
  // Ensure CSRF token is available
  if (!getCsrfToken()) {
    await fetchCsrfToken();
  }

  const toast = useToast();

  try {
    // Create FormData for nested structure
    const formData = new FormData();

    // Append employeeId if exists (optional)
    if (item.employeeId) formData.append("employeeId", item.employeeId.toString());

    // Recursive function to append nested objects to FormData
    const appendNested = (fd: FormData, obj: any, prefix: string) => {
      for (const key in obj) {
        const value = obj[key];
        if (value && typeof value === "object" && !(value instanceof File)) {
          appendNested(fd, value, `${prefix}[${key}]`);
        } else if (value !== undefined && value !== null) {
          fd.append(`${prefix}[${key}]`, value);
        }
      }
    };

    appendNested(formData, item.user || {}, "user");
    appendNested(formData, item.employee || {}, "employee");
    appendNested(formData, item.address || {}, "address");

    // Add CSRF token
    appendCsrfToFormData(formData);

    // Send API request
    const res = await fetch(`${API_BASE}employee/create`, {
      method: "POST",
      credentials: "include",
      body: formData,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        ...addCsrfHeader(),
      },
    });

    const data = await res.json();

    if (data.success) {
      toast.success("Employee created successfully");
      fetchEmployees()
      return data; // return created employee data
    } else {
      toast.error(data.message || "Failed to create employee");
      return data;
    }
  } catch (err: any) {
    toast.error(err.message || "Something went wrong");
    return { success: false, message: err.message };
  }
}

/**
 * Update employee
 */
export async function updateEmployee(
  employeeId: string,
  data: any,
  fetchEmployees: () => void
) {
  const toast = useToast();

  try {
    // Ensure CSRF token is available
    if (!getCsrfToken()) {
      await fetchCsrfToken();
    }

    // Create FormData for nested objects
    const formData = new FormData();
    formData.append("employeeId", employeeId);

    const appendNested = (fd: FormData, obj: any, prefix: string) => {
      for (const key in obj) {
        const value = obj[key];
        if (value && typeof value === "object" && !(value instanceof File)) {
          appendNested(fd, value, `${prefix}[${key}]`);
        } else if (value !== undefined && value !== null) {
          fd.append(`${prefix}[${key}]`, value);
        }
      }
    };

    appendNested(formData, data.user || {}, "user");
    appendNested(formData, data.employee || {}, "employee");
    appendNested(formData, data.address || {}, "address");

    // Append CSRF token
    appendCsrfToFormData(formData);

    // Send API request
    const res = await fetch(`${API_BASE}employee/update`, {
      method: "POST",
      credentials: "include",
      body: formData,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        ...addCsrfHeader(),
      },
    });

    const response = await res.json();

    if (response.success) {
      toast.success("Employee updated successfully");
      fetchEmployees(); // refresh employees list
    } else {
      toast.error(response.message || "Failed to update employee");
    }

    return response;
  } catch (err: any) {
    toast.error(err.message || "Something went wrong");
    return { success: false, message: err.message };
  }
}
/**
 * Delete / deactivate employee
 */
/**
 * Delete / deactivate employee (updated to use FormData like create/update)
 */
export async function handleDeactivate(item: Employee, fetchEmployees: () => void) {
  const toast = useToast();

  if (!confirm(`Delete employee ${item.name}?`)) return { success: false, message: "Cancelled" };

  try {
    // Ensure CSRF token is available
    if (!getCsrfToken()) await fetchCsrfToken();

    // Create FormData
    const formData = new FormData();
    formData.append("employeeId", item.employeeId.toString());

    // Add CSRF token
    appendCsrfToFormData(formData);

    // Send API request
    const res = await fetch(`${API_BASE}employee/delete`, {
      method: "POST",
      credentials: "include",
      body: formData,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        ...addCsrfHeader(),
      },
    });

    const data = await res.json();

    if (data.success) {
      toast.success("Employee deactivated successfully");
      fetchEmployees();
    } else {
      toast.error(data.message || "Failed to deactivate employee");
    }

    return data;
  } catch (err: any) {
    toast.error(err.message || "Failed to delete employee");
    return { success: false, message: err.message };
  }
}

export async function handlePasswordChange(
  passwordData: PasswordData,
  token: string, // JWT token
  fetchUserData?: () => void // optional, e.g., refresh user info
) {
  const toast = useToast();

  // Validation
  if (!passwordData.currentPassword) {
    toast.error("Current password is required");
    return { success: false };
  }
  if (!passwordData.newPassword) {
    toast.error("New password is required");
    return { success: false };
  }
  if (passwordData.newPassword !== passwordData.confirmPassword) {
    toast.error("New passwords do not match");
    return { success: false };
  }
  if (passwordData.newPassword.length < 6) {
    toast.error("Password must be at least 6 characters long");
    return { success: false };
  }
  if (passwordData.currentPassword === passwordData.newPassword) {
    toast.error("New password must be different from current password");
    return { success: false };
  }

  try {
    // Ensure CSRF token is available
    if (!getCsrfToken()) await fetchCsrfToken();

    // Create FormData
    const formData = new FormData();
    formData.append("currentPassword", passwordData.currentPassword);
    formData.append("newPassword", passwordData.newPassword);

    // Add CSRF token
    appendCsrfToFormData(formData);

    // Send API request
    const res = await fetch(`${API_BASE}auth/updatePassword`, {
      method: "POST",
      credentials: "include", // send cookies
      body: formData,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Authorization": `Bearer ${token}`, // JWT token added
        ...addCsrfHeader(), // adds X-CSRF-Token
      },
    });

    const data = await res.json();

    if (data.success) {
      toast.success("Password changed successfully. Please login again.");
      // Optionally refresh user info
      if (fetchUserData) fetchUserData();
      return { success: true };
    } else {
      toast.error(data.message || "Failed to change password");
      return { success: false, message: data.message };
    }
  } catch (err: any) {
    toast.error(err.message || "Something went wrong");
    return { success: false, message: err.message };
  }
}


export async function fetchDashboardData() {
  try {
    const res = await fetch(`${API_BASE}department/Dashboard`, {
      method: "GET",
      credentials: "include",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    const data = await res.json();

    if (data.success) {
      // data.departments and data.employees
      return {
        success: true,
        departments: data.departments || [],
        employees: data.employees || [],
      };
    } else {
      return { success: false, message: data.message || "Failed to fetch data" };
    }
  } catch (err: any) {
    return { success: false, message: err.message || "Something went wrong" };
  }
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}