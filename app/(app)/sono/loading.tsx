import { Skeleton } from "@/components/ui/skeleton";

export default function SonoLoading() {
  return (
    <main className="flex flex-col gap-8 p-4 pb-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-16 rounded-md" />
        </div>
      </div>
      <Skeleton className="h-40 w-full rounded-2xl" />
      <div className="flex flex-col gap-3">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-16 w-full rounded-2xl" />
      </div>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-56 w-full rounded-2xl" />
      </div>
    </main>
  );
}
