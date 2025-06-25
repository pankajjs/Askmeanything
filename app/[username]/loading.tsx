import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col items-center">
      <div className="max-w-2xl w-full py-6 px-6">
        <div className="flex justify-end">
          <Skeleton className="h-10 w-10" />
        </div>
        <div className="my-16">
          <div className="text-center py-2">
            <Skeleton className="h-6 w-3/4 mx-auto" />
          </div>
          <div className="mt-4">
            <Skeleton className="h-24 w-full" />
            <div className="flex justify-end mt-2">
                <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 