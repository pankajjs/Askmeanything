import { API_URL } from "./constant";

export const getUser = async (username: string) => {
  const res = await fetch(`${API_URL}/users?username=${username}`, {
    method: "POST",
  })
  
  if(!res.ok){
    return;
  }

  return (await res.json()).data;
}

export const getAuthUser = async () => {
  const res = await fetch(`${API_URL}/me`, {
    method: "GET",
    credentials: "include",
  })

  if(!res.ok){
    return;
  }
    
  return (await res.json()).data;
}

export const getQuestionsByUser = async (userId: string, page: number, limit: number, date: string) => {
  const res = await fetch(`${API_URL}/users/${userId}/questions?page=${page}&limit=${limit}&date=${date}`, {
    method: "GET",
    credentials: "include",
  })

  if(!res.ok){
    return;
  }

  return (await res.json()).data;
}