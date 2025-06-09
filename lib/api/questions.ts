export const CreateQuestion = async ({data, username, createdBy}: {data: string, username: string, createdBy?: string}) => {
    const res = await fetch("http://localhost:3000/api/questions", {
        method: "POST",
        body: JSON.stringify({data, username, createdBy}),
    })

    if(!res.ok){
        return;
    }

    return (await res.json()).data;
}