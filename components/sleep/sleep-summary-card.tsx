import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SleepLog } from "@/lib/types";

export function SleepSummaryCard({ log }: { log: SleepLog }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sono</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2 text-sm">
        <span className="text-muted-foreground">Dormiu</span>
        <span>{log.hora_dormir?.slice(0, 5)}</span>
        <span className="text-muted-foreground">Acordou</span>
        <span>{log.hora_acordar?.slice(0, 5)}</span>
        <span className="text-muted-foreground">Vezes que acordou</span>
        <span>{log.vezes_acordou}</span>
        <span className="text-muted-foreground">Dormiu bem</span>
        <span>{log.dormiu_bem ? "Sim" : "Não"}</span>
        <span className="text-muted-foreground">Tipo de sono</span>
        <span className="capitalize">{log.tipo_sono}</span>
        <span className="text-muted-foreground">Disposição</span>
        <span>{log.disposicao}/5</span>
      </CardContent>
    </Card>
  );
}
