import { Skeleton } from "@/components/ui/skeleton";

export default function HojeLoading() {
  return (
    <main className="flex flex-col gap-8 p-4 pb-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-48" />
          </div>
          <Skeleton className="size-10 rounded-full" />
        </div>
        <Skeleton className="h-4 w-full max-w-sm" />
        <Skeleton className="h-16 w-full rounded-2xl" />
      </div>

      <div className="flex flex-col gap-3">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    </main>
  );
}
