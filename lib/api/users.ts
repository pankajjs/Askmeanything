export const getUser = async (username: string) => {
  const res = await fetch(`http://localhost:3000/api/users?username=${username}`, {
    method: "POST",
  })
  
  if(!res.ok){
    return;
  }

  return (await res.json()).data;
}

export const getAuthUser = async () => {
  const res = await fetch("http://localhost:3000/api/me", {
    method: "GET",
    credentials: "include",
  })

  if(!res.ok){
    return;
  }
    
  return (await res.json()).data;
}