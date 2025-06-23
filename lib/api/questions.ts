import { API_URL } from "./constant";

export const createQuestion = async ({data, username, createdBy}: {data: string, username: string, createdBy?: string}) => {
    const res = await fetch(`${API_URL}/questions`, {
        method: "POST",
        body: JSON.stringify({data, username, createdBy}),
    })

   return await res.json();
}

export const deleteQuestion = async(id: string) => {
    const res = await fetch(`${API_URL}/questions/${id}`, {
        method: "DELETE",
        credentials: "include",
    })
    
    if(!res.ok){
        throw new Error("Error while deleting question")
    }

    return await res.json();
}