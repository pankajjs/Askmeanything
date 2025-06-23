"use client"

import { CardDescription, CardFooter, CardHeader } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

import {useCallback, useContext, useEffect, useState } from "react";
import { Card } from "./ui/card";
import { AuthContext } from "@/lib/context";
import { PopoverCalendar } from "./calendar";
import { toast } from "sonner";
import { getQuestionsByUser } from "@/lib/api/users";
import { Prisma } from "@/lib/prisma";
import { ChatBubbleIcon, TrashIcon } from "@radix-ui/react-icons";
import { Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "./ui/button";
import { deleteQuestion } from "@/lib/api/questions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export function Dashboard() {

  const [selected, setSelected] = useState("false");

  return <div className="flex flex-col px-6 w-full max-w-2xl">
      <div className="flex justify-end gap-2">
          <Select value={selected} onValueChange={setSelected}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="false">Not answered</SelectItem>
              <SelectItem value="true">Answered</SelectItem>
            </SelectContent>
          </Select>
          {/* <PopoverCalendar date={date} setDate={setDate}/> */}
      </div>
      <div className="flex flex-col py-4 items-center">
       <Questions answered={selected} />
    </div>
  </div>
}

type Questions = Prisma.QuestionGetPayload<{
  select: {
    id: true,
    data: true,
    createdAt: true,
    updatedAt: true,
    userId: true,
    answered: true,
  }
}>

const Questions = ({answered}: {answered: string}) => {
  const {user} = useContext(AuthContext)
  const [questions, setQuestions] = useState<Questions[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchQuestions = useCallback(async ({
    ans
  }: {ans: string})=>{
      const res = await getQuestionsByUser({
        ans,
        page: 1,
        limit: 10,
        userId: user?.id ?? "",
      })
      if(!res.error){
        setQuestions(res.data)
        setIsLoading(false)
      }else{
        setQuestions([])
      }
  }, [user?.id])

  useEffect(() => {
    fetchQuestions({ans: answered})
  }, [fetchQuestions, answered])

  if(isLoading){
    return <>
      <QuestionSkeleton />
      <QuestionSkeleton />
      <QuestionSkeleton />
    </>
  }

  if(questions.length == 0){
    return <div className="text-center py-32 text-sm text-muted-foreground mt-8">No questions found</div>
  }

  return questions.map((question, index) => (
    <Card
      key={index}
      className="w-full mx-auto gap-0 my-2 p-0 shadow-md border rounded-md"
    >
      <CardDescription
        className="px-4 py-2 pb-1 flex justify-center items-center min-h-20 border-b-1 text-sm font-medium w-full break-words break-all whitespace-pre-wrap overflow-x-auto"
      >
        {question.data}
      </CardDescription>
      <CardFooter className="flex justify-between px-4 py-2">
        <div className="flex justify-center items-center gap-2">
          <Button variant={"ghost"}  onClick={()=>deleteQuestion(question.id)}>
              <TrashIcon
            className="w-5 h-5"
            />
          </Button>
          <div className="flex gap-1">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>
       <Button variant={"ghost"} onClick={() => {
            toast.error("Feature not available")
          }}>
          <ChatBubbleIcon className="w-5 h-5"/>
       </Button>
      </CardFooter>
    </Card>
  ))
}

const QuestionSkeleton = () => {
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
