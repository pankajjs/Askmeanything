import { GetStarted } from "@/components/get-started";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] py-24">
      <div className="flex flex-col items-center w-full max-w-2xl px-4">
        <h1
          className="text-4xl font-extrabold mb-2 text-center bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent drop-shadow-lg flex items-center justify-center gap-2"
        >
          AskMeAnything
        </h1>
        <p className="text-md text-muted-foreground mb-6 text-center font-medium">Where curiosity meets honesty</p>
        <p className="text-md text-muted-foreground mb-8 text-center max-w-xl">
          Ask questions anonymously and get honest answers. Join the conversation, connect, and discover new perspectives.
        </p>
        <GetStarted/>
      </div>
    </div>
  );
}
