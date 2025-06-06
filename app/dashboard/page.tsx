"use client"

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const wordGen = (n: number) => {
  let ans = "a"
  for (let i = 0; i < n; i++) {
    ans += "a"
  }
  return ans
}

export default function Dashboard() {
  const [tab, setTab] = useState("questions");
  return <div className="justify-center items-center flex flex-col">
    <div className="flex justify-between w-ful px-2"> 
      <div onClick={() => setTab("questions")} className={`${tab === "questions" ? "bg-gray-200" : "bg-gray-100"} p-2 rounded-md`}>Questions</div>
      <div onClick={() => setTab("replies")} className={`${tab === "replies" ? "bg-gray-200" : "bg-gray-100"} p-2 rounded-md`}>Replies</div>
    </div>
    <div className="">
      {tab === "questions" ? <Questions /> : <Replies />}
    </div>
  </div>
}

const Questions = () => {
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