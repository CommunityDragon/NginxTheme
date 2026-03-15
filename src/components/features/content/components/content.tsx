import { AppWindowIcon, CodeIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { BinViewer } from "@/components/features/bin-viewer";
import { FileExplorer } from "@/components/features/file-explorer";
import { Main } from "@/components/global/main";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIndex } from "@/hooks/nginx";

export const Content: React.FC = () => {
  const { path } = useIndex();
  const { t } = useTranslation();

  return (
    <Main path={path}>
      <Tabs defaultValue="preview">
        <TabsList>
          <TabsTrigger value="explorer">
            <AppWindowIcon />
            {t("tabs.fileExplorer")}
          </TabsTrigger>
          <TabsTrigger value="binviewer">
            <CodeIcon />
            {t("tabs.binViewer")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="explorer">
          <FileExplorer />
        </TabsContent>
        <TabsContent value="binviewer">
          <BinViewer />
        </TabsContent>
      </Tabs>
    </Main>
  );
};
