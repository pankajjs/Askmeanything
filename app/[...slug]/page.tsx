"use client"

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { toast } from "sonner";

const MAX_MESSAGE_LENGTH = 200;

export default function Page() {
    const [message, setMessage] = useState("");
    const [validMessage, setValidMessage] = useState(false);
    const { slug:username } = useParams();

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLDivElement>) => {
        const newMessage = e.currentTarget.innerText ?? "";
        if(newMessage.length > MAX_MESSAGE_LENGTH){
            toast.error("Message is too long");
            setMessage(message.slice(0, MAX_MESSAGE_LENGTH));
        }else{
            setMessage(newMessage);
        }
    }, [message, setMessage]);

    const handlePaste = useCallback((e: React.ClipboardEvent<HTMLDivElement>) => {
        e.preventDefault();
        return false
    }, []);

    useEffect(() => {
        if(message.length > 15){
            setValidMessage(true);
        }else{
            setValidMessage(false);
        }
    }, [message]);
    console.log(message, message.length)

    return <div className="flex items-center justify-center h-screen">
        <div className="px-10 w-[500px] relative">
            <div className="text-xl py-1 font-bold text-wrap text-[#7F55B1]">Ask something interesting to {username}</div>
            <div className={`h-[200px] text-[#7F55B1] tetx-wrap scrollbar-hide overflow-auto p-2 border-1 rounded-md ${validMessage ? "border-[#7F55B1]" : "border-[#9B7EBD]"}`} contentEditable={true} onInput={handleInputChange} onPaste={handlePaste}>
            </div>
            <div className="absolute bottom-6 text-sm text-gray-500">{message.length}/{MAX_MESSAGE_LENGTH}</div>
            <div className="mt-2 flex justify-end">
                <Button className={`hover:bg-[#9B7EBD] text-white font-bold  ${validMessage ? "bg-[#9B7EBD]" : "bg-[#7F55B1]"}`} disabled={!validMessage}>Send</Button>
            </div>
        </div>
    </div>
}