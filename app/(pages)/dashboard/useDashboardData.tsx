// src/hooks/useDashboardData.ts
"use client";

import { useState, useEffect } from "react";
import { fetchDashboardData } from "../employees/action";

export function useDashboardData() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const result = await fetchDashboardData();
      if (result.success) {
        setDepartments(result.departments);
        setEmployees(result.employees);
      } else {
        setError(result.message || "Failed to load dashboard data");
      }
      setLoading(false);
    };

    loadData();
  }, []);

  return { departments, employees, loading, error };
}
