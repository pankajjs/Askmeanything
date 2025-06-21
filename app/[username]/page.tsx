import AskQuestion from "@/components/ask-question";
import { UpdateDetails } from "@/components/update-details";
import { getUser } from "@/lib/api/users";
import { notFound } from "next/navigation";

export default async function Page({params}: {params: Promise<{username: string}>}) {
    const {username} = await params;
    const user = await getUser(username);
    
    if(!user){
        notFound();
    }

    return <div className="flex flex-col items-center">
        <div className="max-w-2xl w-full py-6 px-6">
            <div className="flex justify-end"><UpdateDetails/></div>
            <div className="my-16">
                <div className="text-center py-2 font-bold text-wrap">Ask something interesting to {username}</div>
                <AskQuestion username={username}/>
            </div>
        </div>
    </div>
}