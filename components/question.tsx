import { Clock, TrashIcon } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardDescription, CardFooter } from "./ui/card"
import { deleteQuestion } from "@/lib/api/questions"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"
import { ChatBubbleIcon } from "@radix-ui/react-icons"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Dialog, DialogHeader, DialogContent, DialogTrigger, DialogTitle, DialogFooter } from "./ui/dialog"
import { DialogClose } from "@radix-ui/react-dialog"
import { ReactNode, useCallback, useContext, useState } from "react"
import { createReply } from "@/lib/api/replies"
import { AuthContext } from "@/lib/context"
import { getQuestionByUser } from "@/lib/api/users"
import { QuestionShimmer } from "./shimmer/question"

export const Questions = ({filter}: {filter: string}) => {
  const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: ({id}:{id: string}) => deleteQuestion(id),
        onError(error) {
            toast.error(error.message);
        },
        onSuccess(){
            queryClient.invalidateQueries({queryKey: ["questions"]})
            toast.success("Question deleted")
        }
    })

    const { user } = useContext(AuthContext)
    const userId = user?.id as string;
  
    const {
      isPending, isError, data, error
    } = useQuery({
      queryKey: ["questions", userId, filter],
      queryFn: () => getQuestionByUser({userId, ans: filter}),
      retry(failureCount) {
          return failureCount < 1;
      },
    })
    
    if(isPending){
      return Array.from({length: 4}, ()=>0).map((v, i)=><QuestionShimmer key={i}/>)
    }
    
    if(isError){
      return <div className="text-center py-32 text-sm text-muted-foreground mt-8">{error.message}</div>
    }

    return data?.length == 0 ? 
    <div className="text-center py-32 text-sm text-muted-foreground mt-8">No questions found</div> : 
    data?.map((question, index) => (
      <Card
        key={index}
        className="w-full mx-auto gap-0 my-2 p-0 shadow-md border rounded-md"
      >
        <CardDescription
          className="px-4 py-2 pb-1 flex justify-center items-center min-h-20 border-b-1 text-sm font-medium w-full break-words break-all whitespace-pre-wrap overflow-x-auto"
        >
          {question.data}
        </CardDescription>
        <CardFooter className="flex justify-between px-4 py-2">
          <div className="flex justify-center items-center gap-2">
            <Button variant={"ghost"}  onClick={()=>mutation.mutateAsync({id: question.id})}>
                <TrashIcon
              className="w-5 h-5"
              />
            </Button>
            <div className="flex gap-1">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>
          <SentReply qId={question.id}>
            <Button variant={"ghost"} onClick={() => {
              }}>
              <ChatBubbleIcon className="w-5 h-5"/>
            </Button>
          </SentReply>
        </CardFooter>
      </Card>
    ))
  }

  const MAX_MESSAGE_LENGTH = 200;

  export const SentReply = ({children, qId}: {children: ReactNode, qId: string}) => {
    const queryClient = useQueryClient();
    const [reply, setReply] = useState("");
    const createReplyMutation = useMutation({
      mutationFn: ({data, qId}:{data: string, qId: string})=>createReply({
        data,
        qId,
      }),
      onSuccess(){
        toast.success("Sent your reply")
        queryClient.invalidateQueries({
          queryKey: ["questions"]
        })
        setReply("");
      },
      onError(error){
        toast.error(error.message)
      }
    })
    
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newReply = e.target.value;
      if(newReply.length > MAX_MESSAGE_LENGTH){
          toast.error("Reply is too long");
          setReply(reply.slice(0, MAX_MESSAGE_LENGTH));
      }else{
          setReply(newReply);
      }
  }, [reply, setReply]);

    return  <Dialog>
    <form>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Your reply</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
            <div className="grid gap-3">
                <textarea placeholder="Type your reply here..." className="min-h-[150px] max-h-[150px] w-full text-wrap scrollbar-hide overflow-auto p-2 border-1 rounded-md" value={reply} onChange={handleInputChange}/>
            </div>
        </div>
        <DialogFooter className="flex">
            <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" onClick={()=>{createReplyMutation.mutateAsync({
              data: reply,
              qId,
            })}}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </form>
  </Dialog>
  }