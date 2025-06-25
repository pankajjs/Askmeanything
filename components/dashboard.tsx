"use client"

import { useContext, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Questions } from "./question";
import { Card, CardDescription, CardFooter } from "./ui/card";
import { Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "@/lib/context";
import { getRepliesByUser } from "@/lib/api/replies";
import { QuestionShimmer } from "./shimmer/question";
import Link from "next/link";

export function Dashboard() {
  const [selected, setSelected] = useState("false");
  const [contentType, setContentType] = useState<"Question" | "Reply">("Question");

  return <div className="flex flex-col px-6 w-full max-w-2xl">
      <div className="flex justify-end gap-2">
          <Select value={contentType.toString()} onValueChange={(v)=>{
            setContentType(v === "Question" ? "Question" : "Reply")
          }}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Question">Question</SelectItem>
              <SelectItem value="Reply">Reply</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selected} onValueChange={setSelected}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="false">Not answered</SelectItem>
              <SelectItem value="true">Answered</SelectItem>
            </SelectContent>
          </Select>
      </div>
      <div className="flex flex-col py-4 items-center">
      {contentType == "Question" && <Questions filter={selected}/>}
      {contentType == "Reply" && <Replies/>}
    </div>
  </div>
}

export const Replies = ()=> {
  const {user} = useContext(AuthContext);
  const {
    isPending, isError, data, error
  } = useQuery({
    queryKey: ["replies"],
    queryFn: () => getRepliesByUser({
      userId: user?.id ?? "",
    }),
    retry(failureCount) {
        return failureCount < 1;
    },
  })
  
  if(isPending){
    return Array.from({length: 4}, ()=>0).map((v, i)=><QuestionShimmer key={i}/>)
  }
  
  if(isError){
    return <div className="text-center py-32 text-sm text-muted-foreground mt-8">{error.message}</div>
  }

  return data.length == 0 ? 
  <div className="text-center py-32 text-sm text-muted-foreground mt-8">No replies found</div> : 
  data.map((reply, index) => (
    <Card
      key={index}
      className="w-full mx-auto gap-0 my-2 p-0 shadow-md border rounded-md"
    >
      <CardDescription
        className="px-4 py-2 pb-1 flex justify-center items-center min-h-20 border-b-1 text-sm font-medium w-full break-words break-all whitespace-pre-wrap overflow-x-auto"
      >
        {reply.data}
      </CardDescription>
      <CardFooter className="px-4 py-2">
        <div className="w-full flex justify-between items-center">
        <div className="text-xs text-muted-foreground">
            from <Link href={`/${reply.question.user.username}`}>{`@${reply.question.user.username}`}</Link>
          </div>
          <div className="flex gap-1">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  ))
}

