"use client"

import { CardDescription, CardFooter } from "./ui/card";

import {useCallback, useEffect, useState } from "react";
import { Card } from "./ui/card";
import { wordGen } from "@/lib/utils";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { getAuthUser } from "@/lib/api/users";
import Forbidden from "./forbidden";
import Loader from "./loader";

export function Dashboard({username}: {username: string}) {

  const [tab, setTab] = useState("questions");
  const [forbidden, setForbidden] = useState(false);
  const [auth, setAuth] = useState(false);

  const fetchAuthUser = useCallback(async () => {
    const authUser = await getAuthUser();

    if(!authUser || authUser.username !== username){
        setForbidden(true);
        return;
    }

    setAuth(true);
  }, [])

  useEffect(()=>{
    fetchAuthUser();
  }, [fetchAuthUser])

  if(forbidden){
    return <Forbidden />
  }
  
  return auth ? <div className="justify-center items-center flex flex-col">
    <div className="flex justify-between w-ful px-2"> 
      <div onClick={() => setTab("questions")} className={`${tab === "questions" ? "bg-gray-200" : "bg-gray-100"} p-2 rounded-md`}>Questions</div>
      <div onClick={() => setTab("replies")} className={`${tab === "replies" ? "bg-gray-200" : "bg-gray-100"} p-2 rounded-md`}>Replies</div>
    </div>
    <div className="">
      {tab === "questions" ? <Questions /> : <Replies />}
    </div>
  </div>
  : <Loader />
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