import { Card, CardContent } from "@/components/ui/card";

export const Wrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <Card className="py-2">
    <CardContent className="px-2">{children}</CardContent>
  </Card>
);
