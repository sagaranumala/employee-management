"use client";

import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

export interface Column<T> {
  field: keyof T;
  headerName: string;
  render?: (row: T) => React.ReactNode;
}

interface ReusableTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onAdd?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  rowsPerPageOptions?: number[];
  defaultRowsPerPage?: number;
  lowStockField?: keyof T;
  lowStockThreshold?: number;
}

export default function ReusableTable<T extends Record<string, any>>({
  columns,
  data,
  onAdd,
  onEdit,
  onDelete,
  rowsPerPageOptions = [5, 10, 25],
  defaultRowsPerPage = 10,
  lowStockField,
  lowStockThreshold = 5,
}: ReusableTableProps<T>) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [searchTerm, setSearchTerm] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editingRow, setEditingRow] = useState<T | null>(null);
  const [deleteRow, setDeleteRow] = useState<T | null>(null);
  const [formValues, setFormValues] = useState<Partial<T>>({});

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter((row) =>
      columns.some((col) => {
        const value = row[col.field];
        return value
          ?.toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      })
    );
  }, [searchTerm, data, columns]);

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenAdd = () => {
    setEditingRow(null);
    setFormValues({});
    setOpenForm(true);
  };

  const handleOpenEdit = (row: T) => {
    setEditingRow(row);
    setFormValues(row);
    setOpenForm(true);
  };

  const handleSave = () => {
    if (editingRow) {
      onEdit?.(formValues as T);
    } else {
      onAdd?.(formValues as T);
    }
    setOpenForm(false);
  };

  const handleDelete = () => {
    if (deleteRow) {
      onDelete?.(deleteRow);
      setDeleteRow(null);
    }
  };

  return (
    <Paper className="p-4">
      {/* Search + Add */}
      <div className="flex justify-between items-center mb-4">
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {onAdd && (
          <Button variant="contained" color="primary" onClick={handleOpenAdd}>
            Add
          </Button>
        )}
      </div>

      {/* Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.field as string} className="font-bold bg-gray-100">
                  {col.headerName}
                </TableCell>
              ))}
              {(onEdit || onDelete) && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, rowIndex) => {
                const isLowStock =
                  lowStockField && row[lowStockField] < lowStockThreshold;

                return (
                  <TableRow
                    key={rowIndex}
                    className={isLowStock ? "bg-red-50 hover:bg-red-100" : ""}
                  >
                    {columns.map((col) => (
                      <TableCell key={col.field as string}>
                        {col.render ? col.render(row) : row[col.field]}
                      </TableCell>
                    ))}
                    {(onEdit || onDelete) && (
                      <TableCell className="flex gap-2">
                        {onEdit && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleOpenEdit(row)}
                          >
                            Edit
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() => setDeleteRow(row)}
                          >
                            Delete
                          </Button>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={filteredData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={rowsPerPageOptions}
      />

      {/* Add/Edit Form Dialog */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingRow ? "Edit Item" : "Add Item"}</DialogTitle>
        <DialogContent className="flex flex-col gap-4">
          {columns.map((col) => (
            <TextField
              key={col.field as string}
              label={col.headerName}
              value={formValues[col.field] || ""}
              onChange={(e) =>
                setFormValues({ ...formValues, [col.field]: e.target.value })
              }
              fullWidth
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            {editingRow ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteRow} onClose={() => setDeleteRow(null)}>
        <DialogTitle>Delete Item</DialogTitle>
        <DialogContent>
          Are you sure you want to delete <b>{deleteRow?.name}</b>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteRow(null)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
