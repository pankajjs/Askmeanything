import { Clock, TrashIcon } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardDescription, CardFooter } from "./ui/card"
import { deleteQuestion } from "@/lib/api/questions"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"
import { ChatBubbleIcon } from "@radix-ui/react-icons"
import { Question } from "@/lib/context"

export const Questions = ({questions}: {questions: Question[]}) => {
    return questions.length == 0 ? 
    <div className="text-center py-32 text-sm text-muted-foreground mt-8">No questions found</div> : 
    questions.map((question, index) => (
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
            <Button variant={"ghost"}  onClick={()=>deleteQuestion(question.id)}>
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
         <Button variant={"ghost"} onClick={() => {
              toast.error("Feature not available")
            }}>
            <ChatBubbleIcon className="w-5 h-5"/>
         </Button>
        </CardFooter>
      </Card>
    ))
  }