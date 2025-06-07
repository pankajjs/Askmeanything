export const CreateQuestion = async ({data, username}: {data: string, username: string}) => {
    const res = await fetch("http://localhost:3000/api/questions", {
        method: "POST",
        body: JSON.stringify({data, username}),
    })

    if(!res.ok){
        return;
    }

    return (await res.json()).data;
}