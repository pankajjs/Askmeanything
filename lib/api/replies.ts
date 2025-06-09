export const createReply = async ({data, qId}: {data: string, qId: string}) => {
    const res = await fetch(`http://localhost:3000/api/questions/${qId}/replies`, {
        method: "POST",
        body: JSON.stringify({data}),
        credentials: "include",
    })

    if(!res.ok){
        return;
    }

    return (await res.json()).data;
}