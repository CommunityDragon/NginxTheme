import { useSearch } from "@hooks/search";
import { FileTable } from "./file-table";
import { SearchResultTable } from "./search-result-table";

export const FileExplorer: React.FC = () => {
  const { query } = useSearch();

  const active = query.trim().length > 0;

  return active ? <SearchResultTable /> : <FileTable />;
};
