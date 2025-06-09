"use client"

import { CardDescription, CardFooter } from "./ui/card";

import {useContext, useState } from "react";
import { Card } from "./ui/card";
import { wordGen } from "@/lib/utils";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { AuthContext } from "@/lib/context";
import { PopoverCalendar } from "./calendar";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { toast } from "sonner";

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
    <Card key={index} className="w-[400px] p-0 gap-0 justify-between m-2 min-h-45">
      <CardDescription className="text-wrap break-words p-3">
        {wordGen(5)}
      </CardDescription>
      <CardFooter className="flex-col p-3">
        <Input placeholder="Type your reply..." className="mb-2" />
        <Button className="w-full">Reply</Button>
      </CardFooter>
    </Card>
  ))
}

const Replies = () => {
  return Array(10).fill(0).map((_, index) => (
    <Card key={index} className="w-[400px] p-0">
      <CardDescription className="text-wrap break-words p-3">
        {wordGen(200)}
      </CardDescription>
      <CardFooter className="flex-col p-3">
        <Input placeholder="Type your reply..." className="mb-2" />
        <Button className="w-full">Reply</Button>
      </CardFooter>
    </Card>
  ))
}