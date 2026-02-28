import { Button } from "@components/ui/button";
import { ButtonGroup } from "@components/ui/button-group";
import { Input } from "@components/ui/input";
import { useSearch } from "@hooks/search";
import { LoaderCircleIcon, SearchIcon } from "lucide-react";
import type { TargetedInputEvent } from "preact";
import { useEffect, useId, useState } from "react";

export const Search: React.FC = () => {
  const [search, setSearch] = useState("");
  const { query, loading, mode, setQuery, setMode } = useSearch();

  useEffect(() => {
    setSearch(query);
  }, [query]);

  useEffect(() => {
    if (search !== query) {
      setQuery(search);
    }
  }, [search]);

  const id = useId();

  return (
    <div className="w-full flex gap-2">
      <div className="relative grow">
        <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3">
          <SearchIcon className="size-4" />
          <span className="sr-only">Search</span>
        </div>
        <Input
          id={id}
          type="search"
          placeholder="Search..."
          value={search}
          onChange={(e: TargetedInputEvent<HTMLInputElement>) =>
            setSearch(e.currentTarget.value)
          }
          className="peer px-9 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none"
        />
        {loading && (
          <div className="text-muted-foreground pointer-events-none absolute inset-y-0 right-0 flex items-center justify-center pr-3 peer-disabled:opacity-50">
            <LoaderCircleIcon className="size-4 animate-spin" />
            <span className="sr-only">Loading...</span>
          </div>
        )}
      </div>
      <div className="relative">
        <ButtonGroup>
          <Button
            style={{
              height: `calc(var(--spacing) * 9 + ${mode === "local" ? "2px" : "0px"})`,
              marginTop: mode === "local" ? "-1px" : "0",
            }}
            variant={mode === "local" ? "secondary" : "outline"}
            onClick={() => setMode("local")}
          >
            Local
          </Button>
          <Button
            style={{
              height: `calc(var(--spacing) * 9 + ${mode === "global" ? "2px" : "0px"})`,
              marginTop: mode === "global" ? "-1px" : "0",
            }}
            variant={mode === "global" ? "secondary" : "outline"}
            onClick={() => setMode("global")}
          >
            Global
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
};
