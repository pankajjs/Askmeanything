import { Question, User } from "../context";
import { API_URL } from "./constant";

export const getUser = async (username: string) => {
  return await fetch(`${API_URL}/users?username=${username}`, {
    method: "POST",
  })
}

export const getAuthUser = async (): Promise<User> => {
  const res = await fetch(`${API_URL}/me`, {
    method: "GET",
    credentials: "include",
  })

  if(!res.ok){
    throw new Error("Error while fetching authenticated user")
  }

  return (await res.json()).data;
}


export const updateUser = async ({
  username, status
}: {username?: string, status?: string}): Promise<User> => {
  const res = await fetch(`${API_URL}/me`, {
    method: "PATCH",
    credentials: "include",
    body: JSON.stringify({
      username,
      status,
    })
  })
  
  if(!res.ok){
    throw new Error("Error while updating user details");
  }

  return (await res.json()).data;
}

export const getQuestionsByUser = async ({
  userId, ans
}:{ 
  userId: string,
  ans: string,
}):Promise<Question[]> => {
    const res = await fetch(`${API_URL}/users/${userId}/questions?answered=${ans}`, {
      method: "GET",
      credentials: "include",
    })
    
    if(!res.ok){
      throw new Error("Error while fetching questions")
    }

    return (await res.json()).data;
}