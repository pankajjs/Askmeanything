"use client"

import { CardDescription, CardFooter, CardHeader } from "./ui/card";

import {useCallback, useContext, useEffect, useState } from "react";
import { Card } from "./ui/card";
import { AuthContext } from "@/lib/context";
import { PopoverCalendar } from "./calendar";
import { toast } from "sonner";
import { getQuestionsByUser } from "@/lib/api/users";
import { Prisma } from "@/lib/prisma";
import { TrashIcon } from "@radix-ui/react-icons";
import { ReplyIcon, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "./ui/button";
import { deleteQuestion } from "@/lib/api/questions";

export function Dashboard() {

  const [date, setDate] = useState(new Date());


  if(date > new Date()){
    setDate(new Date())
    toast.error("Date cannot be in the future")
  }
  return <div className="flex flex-col px-6 w-full max-w-2xl">
      <div className="flex justify-end">
          <PopoverCalendar date={date} setDate={setDate}/>
      </div>
      <div className="flex flex-col py-4 items-center">
       <Questions date={date} />
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

const Questions = ({date}: {date: Date}) => {
  const {user} = useContext(AuthContext)
  const [questions, setQuestions] = useState<Questions[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const fetchQuestions = useCallback(async ()=>{
      const res = await getQuestionsByUser(user?.id ?? "", 1, 10, date.getTime().toString())
      if(!res.error){
        setQuestions(res.data)
        setIsLoading(false)
      }
  }, [user?.id, date])

  useEffect(() => {
    fetchQuestions()
  }, [fetchQuestions])

  if(isLoading){
    return <div className="text-center text-sm text-muted-foreground">Loading...</div>
  }

  if(questions.length == 0){
    return <div className="text-center text-sm text-muted-foreground">No questions found</div>
  }

  return questions.map((question, index) => (
    <Card
      key={index}
      className="w-full mx-auto gap-0 my-2 p-0 shadow-md border rounded-md"
    >
      <CardHeader className="flex justify-end items-center gap-2 px-4 pt-2 pb-0">
        <Clock className="w-4 h-4 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
        </span>
      </CardHeader>
      <CardDescription
        className="px-4 py-2 pb-1 flex justify-center items-center min-h-20 border-b-1 text-sm font-medium w-full break-words break-all whitespace-pre-wrap overflow-x-auto"
      >
        {question.data}
      </CardDescription>
      <CardFooter className="flex justify-between px-4 py-2">
        <Button variant={"ghost"}  onClick={()=>deleteQuestion(question.id)}>
            <TrashIcon
          className="w-5 h-5"
          />
        </Button>
       <Button variant={"ghost"}>
       <ReplyIcon
        className="w-5 h-5"
          onClick={() => {/* handle reply logic here */}}
        />
       </Button>
      </CardFooter>
    </Card>
  ))
}
