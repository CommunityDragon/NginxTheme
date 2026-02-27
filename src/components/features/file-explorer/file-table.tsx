import { getFileIcon, sortFiles } from "@lib/utils";
import type { FileEntry, SortColumn, SortDirection } from "@typings/files";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Props {
  files: FileEntry[];
}

export const FileTable: React.FC<Props> = ({ files }) => {
  // Start with no sorting
  const [sortColumn, setSortColumn] = useState<SortColumn | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc"); // only used when sortColumn is not null

  const sortedFiles = useMemo(
    () => sortFiles(files, sortColumn, sortDirection),
    [files, sortColumn, sortDirection],
  );

  const toggleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      // Same column: cycle asc → desc → unsorted
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortColumn(null); // go to unsorted
        // direction can stay as 'desc' or be reset; it's ignored when column is null
      }
    } else {
      // Different column: set to asc
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "-";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const SortIcon = ({ column }: { column: SortColumn }) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  return (
    <div className="rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-full">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSort("name")}
              >
                Name
                <SortIcon column="name" />
              </Button>
            </TableHead>

            <TableHead className="text-right whitespace-nowrap w-min">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSort("size")}
              >
                Size
                <SortIcon column="size" />
              </Button>
            </TableHead>

            <TableHead className="text-right whitespace-nowrap w-min">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSort("date")}
              >
                Modified
                <SortIcon column="date" />
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedFiles.map((file) => {
            const Icon = getFileIcon(file.name, file.isDirectory);
            return (
              <TableRow key={file.link}>
                <TableCell className="font-medium">
                  <a href={file.link} className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {file.name.replace(/\/+$/, "")}
                  </a>
                </TableCell>

                <TableCell className="text-right">
                  {!file.isDirectory && file.size ? (
                    <Badge variant="secondary" className="inline-flex">
                      {file.size.raw}
                    </Badge>
                  ) : (
                    "-"
                  )}
                </TableCell>

                <TableCell className="text-right whitespace-nowrap font-mono pr-5 text-xs">
                  {formatDate(file.date)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
