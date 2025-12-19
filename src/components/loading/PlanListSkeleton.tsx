import { Skeleton } from "@/components/ui/skeleton";

export const PlanListSkeleton = () => {
    return (
        <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex flex-col sm:flex-row gap-4 p-4 border border-border rounded-xl">
                    <div className="flex-1 space-y-2">
                        <div className="flex gap-2">
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-5 w-20 rounded-full" />
                        </div>
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    )
}
