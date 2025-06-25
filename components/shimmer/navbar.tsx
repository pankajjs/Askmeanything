import { Skeleton } from "../ui/skeleton"

export const NavbarShimmer = () => {
  return (
    <div className="px-6 py-4 flex justify-center items-center">
      <div className="flex justify-between items-center border-[1px] rounded-full p-4 w-full xs:w-[80%] md:w-[70%] lg:w-[50%]">
        {/* Logo shimmer */}
        <div>
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
        {/* Nav links shimmer */}
        <div className="nav-links flex items-center justify-center gap-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
      </div>
    </div>
  )
} 