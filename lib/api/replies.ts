import { Reply } from "../types";
import { API_URL } from "./constant";

export const createReply = async ({data, qId}: {data: string, qId: string}): Promise<Reply> => {
    const res = await fetch(`${API_URL}/questions/${qId}/replies`, {
        method: "POST",
        body: JSON.stringify({data}),
        credentials: "include",
    })
    
    const jsonRes = await res.json();

    if(!res.ok){
      throw new Error(jsonRes.message)
    }
  
    return jsonRes.data;
}

export const getRepliesByUser = async ({userId}: {userId: string}): Promise<Reply[]> => {
    const res = await fetch(`${API_URL}/users/${userId}/replies`, {
        credentials: "include",
        method: "GET",
    })

    const jsonRes = await res.json();

    if(!res.ok){
      throw new Error(jsonRes.message)
    }
  
    return jsonRes.data;
}