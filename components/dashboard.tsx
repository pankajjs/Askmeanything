"use client"

import { CardDescription, CardFooter, CardHeader } from "./ui/card";

import {useCallback, useContext, useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { AuthContext } from "@/lib/context";
import { PopoverCalendar } from "./calendar";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { Textarea } from "./ui/textarea";
import { getQuestionsByUser } from "@/lib/api/users";
import { Prisma } from "@/lib/prisma";
import { createReply, getRepliesByUser } from "@/lib/api/replies";
import { Calendar } from "./ui/calendar";

export function Dashboard() {

  const [currentTab, setCurrentTab] = useState("questions");
  const [date, setDate] = useState(new Date());


  if(date > new Date()){
    setDate(new Date())
    toast.error("Date cannot be in the future")
  }
  return <div className="flex flex-col-reverse md:flex-row md:gap-6">
    <div className="flex justify-between flex-col py-4 items-center">
      {currentTab === "questions" ? <Questions date={date} /> : <Replies date={date} />}  
    </div>
      <div className="flex py-4 justify-between md:flex-col md:justify-start md:gap-4 max-md:px-10">
        <div className="hidden md:block">
          <Calendar className="rounded-md border shadow-sm" captionLayout="dropdown" mode="single" selected={date} onSelect={(date) => setDate(date || new Date())}/>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex justify-center items-center gap-2">
            <Checkbox id="questions" defaultChecked={currentTab === "questions"} onClick={() => setCurrentTab("questions")} checked={currentTab === "questions"}/>
            <Label htmlFor="questions">Questions</Label>
          </div>
          <div className="flex justify-center items-center gap-2">
            <Checkbox id="replies" checked={currentTab === "replies"} onClick={() => setCurrentTab("replies")}/>
            <Label htmlFor="replies">Replies</Label>
          </div>
        </div>
      <div className="md:hidden">
        <PopoverCalendar date={date} setDate={setDate}/>
      </div>
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
      const questions = await getQuestionsByUser(user?.id ?? "", 1, 10, date.getTime().toString())
      if(!questions){
        return;
      }
      setQuestions(questions)
      setIsLoading(false)
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
    <Card key={index} className="gap-0 justify-between my-2 p-0 min-h-30 max-md:xs:min-w-[90%] md:min-w-110 w-[90%]">
      <CardDescription className="text-wrap break-words p-3 text-sm font-medium">
        {question.data}
      </CardDescription>
      <CardFooter className="flex flex-col p-3 gap-2">
        <Answer qId={question.id}/>
      </CardFooter>
    </Card>
  ))
}

const Replies = ({date}: {date: Date}) => {
  const {user} = useContext(AuthContext)
  const [showQuestion, setShowQuestion] = useState<number | null>(null)
  const [replies, setReplies] = useState<Prisma.ReplyGetPayload<{include: {
    question: {
      omit: {
          answered: true,
          createdAt: true,
          updatedAt: true,
          userId: true,
          id: true,
          createdBy: true,
      },
      include:{
          user: {
              select:{
                  username: true,
              }
          }
      },
  }
  }}>[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const fetchReplies = useCallback(async () => {
    const replies = await getRepliesByUser({userId: user?.id ?? "", page: 1, limit: 10, date: date.getTime().toString()})
    if(!replies){
      return;
    }
    setReplies(replies)
    setIsLoading(false)
  }, [user?.id, date])

  useEffect(() => {
    fetchReplies()
  }, [fetchReplies])

  if(isLoading){
    return <div className="text-center text-sm text-muted-foreground">Loading...</div>
  }

  if(replies.length === 0){
    return <div className="text-center text-sm text-muted-foreground">No replies found</div>
  }

  return replies.map((reply, index) => (
    <Card key={index} className="w-full p-0 gap-0 my-4">
      <CardHeader className="flex justify-end text-xs p-4 pb-0">
        Replies from {reply.question.user.username}
      </CardHeader>
      <CardDescription className="text-wrap break-words px-4 py-2">
        {reply.data}
      </CardDescription>
      <CardFooter className="block px-4">
        { showQuestion === index && <div className="text-wrap text-sm break-words">{reply.question.data}</div>}
        <Button variant={"link"} className="text-xs mx-1 p-0 float-end" onClick={() => setShowQuestion(showQuestion === index ? null : index)}>{showQuestion === index ? "Hide question" : "Show question"}</Button>
      </CardFooter>
    </Card>
  ))
}


const Answer = ({qId}: { qId: string}) => {
  const [answer, setAnswer] = useState("")
  const handleReply = useCallback(async () => {
    const res = await createReply({data: answer, qId: qId})
    if(res){
      toast.success("Reply created successfully")
    }else{
      toast.error("Failed to send reply")
    }
  }, [answer, qId])
  return (
    <>
    <textarea placeholder="Type your message here." className="w-full border-1 scrollbar-hide rounded-sm p-2 text-sm resize-none" value={answer} onChange={(e) => setAnswer(e.target.value)}/>
    <Button className="w-full" onClick={handleReply}>Reply</Button>
    </>
  )
}