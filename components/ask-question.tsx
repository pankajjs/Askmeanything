"use client"

import { useCallback, useContext, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { createQuestion } from "@/lib/api/questions";
import { AuthContext } from "@/lib/context";

const MAX_MESSAGE_LENGTH = 200;

export default function AskQuestion({username}: {username: string}) {
    const [message, setMessage] = useState("");
    const [validMessage, setValidMessage] = useState(false);
    const {user} = useContext(AuthContext)

    const handleSend = useCallback(async () => {
        const res = await createQuestion({data: message, username, createdBy: user?.id});
        if(res.ok){
            setMessage("");
            toast.success(res.message);
        }else{
            toast.error(res.message);
        }
    }, [message, user?.id, username]);
    
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newMessage = e.target.value;
        if(newMessage.length > MAX_MESSAGE_LENGTH){
            toast.error("Message is too long");
            setMessage(message.slice(0, MAX_MESSAGE_LENGTH));
        }else{
            setMessage(newMessage);
        }
    }, [message, setMessage]);

    const handlePaste = useCallback((e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        e.preventDefault();
        toast.info("Pasting is not allowed")
        return false
    }, []);

    useEffect(() => {
        if(message.length > 15){
            setValidMessage(true);
        }else{
            setValidMessage(false);
        }
    }, [message]);    
    return (
        <div className="w-full">
            <textarea onPaste={handlePaste} placeholder="Type your question here..." className="h-[200px] w-full text-wrap scrollbar-hide overflow-auto p-2 border-1 rounded-md" value={message} onChange={handleInputChange}/>
            <div className="text-sm flex justify-between">
                <span>{message.length}/{MAX_MESSAGE_LENGTH}</span>
                <Button disabled={!validMessage} onClick={handleSend} className="w-20">Send</Button>
            </div>
        </div>
    )
}