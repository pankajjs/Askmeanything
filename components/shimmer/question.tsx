import { Card, CardDescription, CardFooter, CardHeader } from "../ui/card"
import { Skeleton } from "../ui/skeleton"

export const QuestionShimmer = () => {
    return (
      <Card className="w-full mx-auto gap-0 my-2 p-0 shadow-md border rounded-md">
        <CardHeader className="flex flex-row justify-end items-center gap-2 px-4 pt-2 pb-0">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
        </CardHeader>
        <CardDescription
          className="px-4 py-2 pb-1 flex justify-center items-center min-h-20 border-b-1 text-sm font-medium w-full break-words break-all whitespace-pre-wrap overflow-x-auto"
        >
          <Skeleton className="h-10 w-full" />
        </CardDescription>
        <CardFooter className="flex justify-between px-4 py-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </CardFooter>
      </Card>
    )
  }
  