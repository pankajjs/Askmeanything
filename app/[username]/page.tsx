import AskQuestion from "@/components/ask-question";
import { getUser } from "@/lib/api/users";
import { notFound } from "next/navigation";

export default async function Page({params}: {params: Promise<{username: string}>}) {
    const {username} = await params;
    const user = await getUser(username);
    
    if(!user){
        notFound();
    }

    return <div className="flex items-center justify-center h-screen">
        <div className="px-10 w-[500px] relative">
            <div className="text-xl py-1 font-bold text-wrap text-[#7F55B1]">Ask something interesting to {username}</div>
            <AskQuestion  username={username}/>
        </div>
    </div>
}