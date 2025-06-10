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