import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Appointment } from "@shared/schema";
import { useSortableData } from "@/hooks/useSortableData";
import AppointmentRow from "./AppointmentRow";

interface AppointmentListProps {
  appointments: Appointment[];
  isLoading: boolean;
  onEditClick: (uniqueId: string) => void;
}

export default function AppointmentList({
  appointments,
  isLoading,
  onEditClick,
}: AppointmentListProps) {
  const { items, requestSort, sortConfig } = useSortableData(appointments);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const getSortIndicator = (columnName: string) => {
    if (sortConfig?.key === columnName) {
      return sortConfig.direction === "ascending" ? "↑" : "↓";
    }
    return null;
  };

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Generate page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <section className="mb-8">
      <Card>
        <CardHeader className="py-4 px-6 border-b border-gray-200">
          <CardTitle>لیست نوبت‌ها</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-100 text-right"
                    onClick={() => requestSort("uniqueId")}
                  >
                    کد پیگیری{" "}
                    <ArrowUpDown className="mr-2 h-4 w-4 inline-block float-left" />
                    {getSortIndicator("uniqueId")}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-100 text-right"
                    onClick={() => requestSort("applicationDate")}
                  >
                    تاریخ درخواست{" "}
                    <ArrowUpDown className="mr-2 h-4 w-4 inline-block float-left" />
                    {getSortIndicator("applicationDate")}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-100 text-right"
                    onClick={() => requestSort("applicationTime")}
                  >
                    زمان درخواست{" "}
                    <ArrowUpDown className="mr-2 h-4 w-4 inline-block float-left" />
                    {getSortIndicator("applicationTime")}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-100 text-right"
                    onClick={() => requestSort("paymentDate")}
                  >
                    تاریخ پرداخت{" "}
                    <ArrowUpDown className="mr-2 h-4 w-4 inline-block float-left" />
                    {getSortIndicator("paymentDate")}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-100 text-right"
                    onClick={() => requestSort("appointmentDate")}
                  >
                    تاریخ نوبت (میلادی){" "}
                    <ArrowUpDown className="mr-2 h-4 w-4 inline-block float-left" />
                    {getSortIndicator("appointmentDate")}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-100 text-right"
                    onClick={() => requestSort("appointmentTime")}
                  >
                    زمان نوبت{" "}
                    <ArrowUpDown className="mr-2 h-4 w-4 inline-block float-left" />
                    {getSortIndicator("appointmentTime")}
                  </TableHead>
                  <TableHead className="text-right">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  // Loading skeleton
                  Array.from({ length: 3 }).map((_, index) => (
                    <TableRow key={index}>
                      {Array.from({ length: 7 }).map((_, cellIndex) => (
                        <TableCell key={cellIndex}>
                          <Skeleton className="h-6 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : currentItems.length > 0 ? (
                  // Appointment rows
                  currentItems.map((appointment) => (
                    <AppointmentRow
                      key={appointment.uniqueId}
                      appointment={appointment}
                      onEditClick={onEditClick}
                    />
                  ))
                ) : (
                  // No results
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      موردی برای نمایش وجود ندارد
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {appointments.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    نمایش <span className="font-medium">{indexOfFirstItem + 1}</span> تا{" "}
                    <span className="font-medium">
                      {Math.min(indexOfLastItem, items.length)}
                    </span>{" "}
                    از <span className="font-medium">{items.length}</span> نتیجه
                  </p>
                </div>
                <Pagination>
                  <PaginationContent>
                    {currentPage > 1 && (
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => paginate(currentPage - 1)}
                          className="cursor-pointer"
                        />
                      </PaginationItem>
                    )}
                    
                    {pageNumbers.map((number) => (
                      <PaginationItem key={number}>
                        <PaginationLink
                          onClick={() => paginate(number)}
                          isActive={currentPage === number}
                          className="cursor-pointer"
                        >
                          {number}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    {currentPage < totalPages && (
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => paginate(currentPage + 1)}
                          className="cursor-pointer"
                        />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
