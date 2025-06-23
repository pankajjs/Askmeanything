import { Question } from "../context";
import { API_URL } from "./constant";

export const getUser = async (username: string) => {
  const res = await fetch(`${API_URL}/users?username=${username}`, {
    method: "POST",
  })

  return await res.json();
}

export const getAuthUser = async () => {
  const res = await fetch(`${API_URL}/me`, {
    method: "GET",
    credentials: "include",
  })
  return await res.json();
}

export const updateUser = async ({
  username, status
}: {username?: string, status?: string}) => {
  const res = await fetch(`${API_URL}/me`, {
    method: "PATCH",
    credentials: "include",
    body: JSON.stringify({
      username,
      status,
    })
  })
  return await res.json();
}

export const getQuestionsByUser = async ({
  userId, page, ans
}:{ 
  userId: string,
  page: number,
  ans: string,
}):Promise<Question[]> => {
    const res = await fetch(`${API_URL}/users/${userId}/questions?page=${page}&answered=${ans}`, {
      method: "GET",
      credentials: "include",
    })
    
    if(!res.ok){
      throw new Error("Error while fetching questions")
    }
    
    return (await res.json()).data;
}