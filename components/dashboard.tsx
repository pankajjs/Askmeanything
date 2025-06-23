"use client"

import {useContext, useState } from "react";
import { AuthContext } from "@/lib/context";
import { getQuestionsByUser } from "@/lib/api/users";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { QuestionShimmer } from "./shimmer/question";
import { useQuery } from "@tanstack/react-query";
import { Questions } from "./question";

export function Dashboard() {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState("false");
  
  const { user } = useContext(AuthContext)
  const userId = user?.id as string;
  
  const {
    isPending, isError, data, error
  } = useQuery({
    queryKey: ["questions", userId, page, selected],
    queryFn: ()=>getQuestionsByUser({userId, page, ans: selected}),
    retry(failureCount) {
        return failureCount < 1;
    },
  })

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
      </div>
      <div className="flex flex-col py-4 items-center">
      {isPending && Array.from({length: 4}, ()=>0).map((v, i)=><QuestionShimmer key={i}/>)}
      {isError && <div className="text-center py-32 text-sm text-muted-foreground mt-8">{error.message}</div>}
      {data && <Questions questions={data}/>}
    </div>
  </div>
}

