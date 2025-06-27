import { Question } from "../types";
import { API_URL } from "./constant";

export const createQuestion = async ({data, username, createdBy}: {data: string, username: string, createdBy?: string}): Promise<Question> => {
    const res = await fetch(`${API_URL}/questions`, {
        method: "POST",
        body: JSON.stringify({data, username, createdBy}),
    })
    
    const jsonRes = await res.json();

    if(!jsonRes.success){
      throw new Error(jsonRes.message)
    }
  
    return jsonRes.data;
}

export const deleteQuestion = async(id: string) => {
    const res = await fetch(`${API_URL}/questions/${id}`, {
        method: "DELETE",
        credentials: "include",
    })
    
    const jsonRes = await res.json();

    if(!jsonRes.success){
      throw new Error(jsonRes.message)
    }
  
    return jsonRes.data;
}