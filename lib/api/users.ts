import { Question, User } from "../types";
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

  const jsonRes = await res.json();

  if(!jsonRes.error){
    throw new Error(jsonRes.message);
  }

  return jsonRes;
}


export const updateUser = async ({
  username, status, active
}: {username?: string, status?: string, active?: boolean}): Promise<User> => {
  const res = await fetch(`${API_URL}/me`, {
    method: "PATCH",
    credentials: "include",
    body: JSON.stringify({
      username,
      status,
      active
    })
  })
  
  const jsonRes = await res.json();

  if(!jsonRes.error){
    throw new Error(jsonRes.message)
  }

  return jsonRes;
}

export const getQuestionByUser = async ({
  userId, ans
}:{ 
  userId: string,
  ans: string,
}):Promise<Question[]> => {
  
  const res = await fetch(`${API_URL}/users/${userId}/questions?answered=${ans}`, {
    method: "GET",
    credentials: "include",
  })
  
  const jsonRes = await res.json();

  if(!jsonRes.error){
    throw new Error(jsonRes.message)
  }

  return jsonRes;
}

export const getRepliesByUser = async ({userId}:{userId: string})=>{
  const res = await fetch(`${API_URL}/users/${userId}/replies`, {
    method: "GET",
    credentials: "include",
  });

  const jsonRes = await res.json();

  if(!jsonRes.error){
    throw new Error(jsonRes.message)
  }

  return jsonRes;
}