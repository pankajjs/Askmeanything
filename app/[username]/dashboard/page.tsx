import { Dashboard } from "@/components/dashboard";
import { getAuthUser, getUser } from "@/lib/api/users";
import { notFound } from "next/navigation";

export default async function Page({params}: {params: {username: string}}) {
  const {username} = params;
  const user = await getUser(username);

  if(!user){
    notFound();
  }

  return  <Dashboard username={user.username}/>
}

