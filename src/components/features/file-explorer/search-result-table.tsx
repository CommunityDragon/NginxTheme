import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@components/ui/empty";
import { Spinner } from "@components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import { useFileExplorer } from "@hooks/file-explorer";
import { useSearch } from "@hooks/search";
import { useEffect } from "react";

export const SearchResultTable: React.FC = () => {
  const { query, loading } = useSearch();
  const { search, results, error, dispose } = useFileExplorer();

  // Trigger search whenever the query changes
  useEffect(() => {
    search(query);
  }, [query, search]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      dispose();
    };
  }, [dispose]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (loading) {
    return (
      <Empty className="w-full">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Spinner />
          </EmptyMedia>
          <EmptyTitle>Processing file entries</EmptyTitle>
          <EmptyDescription>
            Searching through file entries, please wait...
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No results found.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {results.slice(0, 10000).map((result, index) => (
          <TableRow key={index}>
            <TableCell>
              <a href={result.href}>{result.filename}</a>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
