"use client"

import { useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { CreateQuestion } from "@/lib/api/questions";

const MAX_MESSAGE_LENGTH = 200;

export default function AskQuestion({username}: {username: string}) {
    const [message, setMessage] = useState("");
    const [validMessage, setValidMessage] = useState(false);

    const handleSend = useCallback(async () => {
        const question = await CreateQuestion({data: message, username});
        if(question){
            console.log(question);
            setMessage("");
            toast.success("Question sent successfully");
        }else{
            toast.error("Failed to send question. Please try again.");
        }
    }, [message]);
    
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
    return (
        <>
            <div className={`h-[200px] text-wrap scrollbar-hide overflow-auto p-2 border-1 rounded-md`} contentEditable={true} onInput={handleInputChange} onPaste={handlePaste}>
            </div>
            <div className="absolute bottom-6 text-sm">{message.length}/{MAX_MESSAGE_LENGTH}</div>
            <div className="mt-2 flex justify-end">
                <Button disabled={!validMessage} onClick={handleSend}>Send</Button>
            </div>
        </>
    )
}