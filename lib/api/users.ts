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

export const getQuestionsByUser = async ({
  userId, page, limit, date, ans
}:{ 
  userId: string,
  page: number,
  limit: number,
  date: string,
  ans: string,
}) => {

  const res = await fetch(`${API_URL}/users/${userId}/questions?page=${page}&limit=${limit}&date=${date}&answered=${ans}`, {
    method: "GET",
    credentials: "include",
  })

  return await res.json();
}