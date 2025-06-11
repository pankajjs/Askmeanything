import { API_URL } from "./constant";

export const createReply = async ({data, qId}: {data: string, qId: string}) => {
    const res = await fetch(`${API_URL}/questions/${qId}/replies`, {
        method: "POST",
        body: JSON.stringify({data}),
        credentials: "include",
    })

    return await res.json();
}

export const getRepliesByUser = async ({userId, page, limit, date}: {userId: string, page: number, limit: number, date: string}) => {
    const res = await fetch(`${API_URL}/users/${userId}/replies?page=${page}&limit=${limit}&date=${date}`, {
        credentials: "include",
        method: "GET",
    })

    return await res.json();
}