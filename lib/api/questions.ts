import { API_URL } from "./constant";
export const CreateQuestion = async ({data, username, createdBy}: {data: string, username: string, createdBy?: string}) => {
    const res = await fetch(`${API_URL}/questions`, {
        method: "POST",
        body: JSON.stringify({data, username, createdBy}),
    })

    if(!res.ok){
        return;
    }

    return (await res.json()).data;
}