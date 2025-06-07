import AskQuestion from "@/components/ask-question";
import { notFound } from "next/navigation";


const fetchUser = async (username: string) => {
    console.log(username);
    const res = await fetch(`http://localhost:3000/api/users?username=${username}`, {
        method: "POST",
    })
    if(!res.ok){
        return;    
    }
    return res.json()
}

export default async function Page({params}: {params: {username: string}}) {
    const {username} = params;
    console.log(username);
    const user = await fetchUser(username);
    
    if(!user){
        notFound();
    }

    return <div className="flex items-center justify-center h-screen">
        <div className="px-10 w-[500px] relative">
            <div className="text-xl py-1 font-bold text-wrap text-[#7F55B1]">Ask something interesting to {username}</div>
            <AskQuestion />
        </div>
    </div>
}