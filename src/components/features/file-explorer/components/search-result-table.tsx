import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFileExplorer } from "@/hooks/file-explorer";
import { useSearch } from "@/hooks/search";

export const SearchResultTable: React.FC = () => {
  const { t } = useTranslation();
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
    return (
      <div>
        {t("errors.prefix")} {error.message}
      </div>
    );
  }

  if (loading) {
    return (
      <Empty className="w-full">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Spinner />
          </EmptyMedia>
          <EmptyTitle>{t("fileExplorer.processing")}</EmptyTitle>
          <EmptyDescription>{t("fileExplorer.searching")}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {t("fileExplorer.noResults")}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("fileExplorer.name")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {results.slice(0, 10000).map((result) => (
          <TableRow key={result.filename}>
            <TableCell>
              <a href={result.href}>{result.filename}</a>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
