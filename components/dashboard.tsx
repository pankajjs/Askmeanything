"use client"

import { CardDescription, CardFooter, CardHeader } from "./ui/card";

import {useContext, useState } from "react";
import { Card } from "./ui/card";
import { wordGen } from "@/lib/utils";
import { Button } from "./ui/button";
import { AuthContext } from "@/lib/context";
import { PopoverCalendar } from "./calendar";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { Textarea } from "./ui/textarea";

export function Dashboard() {

  const [currentTab, setCurrentTab] = useState("questions");
  const [date, setDate] = useState(new Date());


  if(date > new Date()){
    setDate(new Date())
    toast.error("Date cannot be in the future")
  }
  return <div className="px-8">
      <div className="flex justify-between items-center py-4">
       <div className="flex gap-4 flex-col">
       <div className="flex items-center gap-1">
          <Checkbox id="questions" defaultChecked={currentTab === "questions"} onClick={() => setCurrentTab("questions")} checked={currentTab === "questions"}/>
          <Label htmlFor="questions">Questions</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="replies" checked={currentTab === "replies"} onClick={() => setCurrentTab("replies")}/>
          <Label htmlFor="replies">Replies</Label>
        </div>
       </div>
        <PopoverCalendar date={date} setDate={setDate}/>
      </div>
      {currentTab === "questions" ? <Questions /> : <Replies />}
  </div>
}

const Questions = () => {
  const {user} = useContext(AuthContext)
  return Array(10).fill(0).map((_, index) => (
    <Card key={index} className="w-full gap-0 justify-between my-4 p-0 min-h-30">
      <CardDescription className="text-wrap break-words p-3 text-sm font-medium">
        {wordGen(100)}
      </CardDescription>
      <CardFooter className="flex flex-col p-3 gap-2">
        <Answer />
        <Button className="w-full">Reply</Button>
      </CardFooter>
    </Card>
  ))
}

const Replies = () => {
  const [showQuestion, setShowQuestion] = useState<number | null>(null)
  return Array(10).fill(0).map((_, index) => (
    <Card key={index} className="w-full p-0 gap-0 my-4">
      <CardHeader className="flex justify-end text-xs p-4 pb-0">
        Replies from @{"dummy"}
      </CardHeader>
      <CardDescription className="text-wrap break-words px-4 py-2">
        {wordGen(210)}
      </CardDescription>
      <CardFooter className="block px-4">
        { showQuestion === index && <div className="text-wrap text-sm break-words">{wordGen(100)}</div>}
        <Button variant={"link"} className="text-xs mx-1 p-0 float-end" onClick={() => setShowQuestion(showQuestion === index ? null : index)}>{showQuestion === index ? "Hide question" : "Show question"}</Button>
      </CardFooter>
    </Card>
  ))
}


const Answer = () => {
  return (
    <Textarea placeholder="Type your message here." className="w-full text-sm resize-none" />
  )
}