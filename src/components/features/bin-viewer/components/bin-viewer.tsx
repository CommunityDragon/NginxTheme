import { useTranslation } from "react-i18next";

export const BinViewer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">{t("tabs.binViewer")}</h2>
      <p className="text-muted-foreground">{t("binViewer.description")}</p>
    </div>
  );
};
