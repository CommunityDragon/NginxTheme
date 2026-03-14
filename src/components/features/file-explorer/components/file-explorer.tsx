import { useEffect, useState } from "react";
import { useSearch } from "@/hooks/search";
import { FileTable } from "./file-table";
import { SearchResultTable } from "./search-result-table";

export const FileExplorer: React.FC = () => {
  const { query } = useSearch();
  const [active, setActive] = useState(() => query.trim().length > 0);

  useEffect(() => {
    setActive(query.trim().length > 0);
  }, [query]);

  return (
    <>
      <div className={active ? "hidden" : ""}>
        <FileTable />
      </div>
      <div className={active ? "" : "hidden"}>
        <SearchResultTable />
      </div>
    </>
  );
};
