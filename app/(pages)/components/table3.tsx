"use client";

import React, { useState, useMemo, ReactNode } from "react";
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
  highlightRowId?: string | null;
  customForm?: ReactNode;
  customEditForm?: (item: T, onSave: (item: T) => void) => ReactNode;
}

export default function ReusableTable<T extends Record<string, any>>({
  columns,
  data,
  onAdd,
  onEdit,
  onDelete,
  rowsPerPageOptions = [5, 10, 25],
  defaultRowsPerPage = 10,
  highlightRowId,
  customForm,
  customEditForm,
}: ReusableTableProps<T>) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [searchTerm, setSearchTerm] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editingRow, setEditingRow] = useState<T | null>(null);

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter((row) =>
      columns.some((col) => {
        const value = row[col.field];
        return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [searchTerm, data, columns]);

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleOpenAdd = () => {
    setEditingRow(null);
    setOpenForm(true);
  };

  const handleOpenEdit = (row: T) => {
    setEditingRow(row);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingRow(null);
  };

  return (
    <Paper className="p-4 relative">
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
              .map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  id={highlightRowId === row.id ? `row-${row.id}` : undefined}
                  className={highlightRowId === row.id ? "bg-green-100" : ""}
                >
                  {columns.map((col) => (
                    <TableCell key={col.field as string}>
                      {col.render ? col.render(row) : row[col.field]}
                    </TableCell>
                  ))}
                  {(onEdit || onDelete) && (
                    <TableCell className="flex gap-2">
                      {onEdit && (
                        <Button size="small" variant="outlined" onClick={() => handleOpenEdit(row)}>
                          Edit
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => onDelete(row)}
                        >
                          Delete
                        </Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
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

      {/* Dialog */}
      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="md" fullWidth scroll="paper">
        <DialogTitle>{editingRow ? "Edit Item" : "Add Item"}</DialogTitle>
        <DialogContent dividers>
          {editingRow
            ? customEditForm?.(editingRow, (updatedItem) => {
                onEdit?.(updatedItem);
                handleCloseForm();
              })
            : customForm &&
              React.cloneElement(customForm as React.ReactElement, {
                onSubmit: (item: T) => {
                  onAdd?.(item);
                  handleCloseForm();
                },
              })}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
