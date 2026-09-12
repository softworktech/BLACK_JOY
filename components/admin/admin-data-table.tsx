"use client";

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

export interface Pagination {
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
}

export interface Column {
  key: string;
  label: string;
  render?: (row: any) => React.ReactNode;
}

interface AdminDataTableProps {
  columns: Column[];
  data: any[];
  loading?: boolean;
  pagination?: Pagination;
  onPageChange?: (page: number) => void;
  onSearch?: (term: string) => void;
  searchPlaceholder?: string;
  actions?: React.ReactNode;
}

export function AdminDataTable({
  columns,
  data,
  loading = false,
  pagination,
  onPageChange,
  onSearch,
  searchPlaceholder = "Search...",
  actions
}: AdminDataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {onSearch && (
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder={searchPlaceholder}
              className="pl-9 bg-white"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        )}
        {actions && (
          <div className="flex items-center gap-2 ml-auto w-full sm:w-auto">
            {actions}
          </div>
        )}
      </div>

      <div className="border rounded-md bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                {columns.map((col) => (
                  <TableHead key={col.key} className="text-gray-700 font-semibold whitespace-nowrap">
                    {col.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {columns.map((col, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-6 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : data && data.length > 0 ? (
                data.map((row, i) => (
                  <TableRow key={row.id || i}>
                    {columns.map((col) => (
                      <TableCell key={col.key}>
                        {col.render ? col.render(row) : row[col.key]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500">
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {pagination && pagination.last_page > 1 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-gray-500">
            Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of {pagination.total} entries
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange && onPageChange(pagination.current_page - 1)}
              disabled={pagination.current_page === 1 || loading}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                let pageNum = i + 1;
                // Simple logic to show pages around current
                if (pagination.last_page > 5) {
                  if (pagination.current_page > 3) {
                    pageNum = pagination.current_page - 2 + i;
                    if (pageNum > pagination.last_page) {
                      pageNum = pagination.last_page - (4 - i);
                    }
                  }
                }
                return (
                  <Button
                    key={pageNum}
                    variant={pagination.current_page === pageNum ? "default" : "outline"}
                    size="icon"
                    className={`h-8 w-8 ${pagination.current_page === pageNum ? 'bg-orange-500 hover:bg-orange-600 text-white' : ''}`}
                    onClick={() => onPageChange && onPageChange(pageNum)}
                    disabled={loading}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange && onPageChange(pagination.current_page + 1)}
              disabled={pagination.current_page === pagination.last_page || loading}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
