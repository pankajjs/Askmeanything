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

    return <div className="flex flex-col items-center justify-center px-6">
        <div className="flex flex-col gap-10 w-full sm:w-[70%] md:w-[30%] lg:w-[40%]">
            <div className="flex justify-end w-full">
                <UpdateDetails/>
            </div>
            <div className="w-full">
                <div className="text-center py-2 font-bold text-wrap">Ask something interesting to {username}</div>
                <AskQuestion username={username}/>
            </div>
        </div>
    </div>
}