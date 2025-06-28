import { db } from "../config/firestore"
import { NotFoundError } from "../errors";
import { User } from "../types";

export const findUserByEmail = async (email: string): Promise<User | null> => {
    try{
        const users =  await db.collection("users").where("email", '==', email).get();
        
        if(users.empty){
            throw new NotFoundError("User not found");
        }
        return {
            id: users.docs[0].id,
            ...users.docs[0].data()
        } as unknown as User;
    }catch(error){
        console.error("Error while fetching user by email", error)
        return null;
    }
}

export const createUser = async(email: string): Promise<User> => {
    try{
        const user = await db.collection("users").add({
            email,
            username: email.split('@')[0],
            roles: {
                "admin": false,
                "user": true
            },
            createAt: Date.now(),
            updatetAt: Date.now(),
            active: true,
            status: "Ask some interesting question huh:)"
        })


        return {
            id: user.id,
            ...(await user.get()).data(),
        } as unknown as  User;
    }catch(error){
        console.error("Error while creating user", error);
        throw error;
    }
}

export const findUserById = async (id: string): Promise<User> => {
    try{
        const user = await db.collection("users").doc(id).get();
        
        if(!user.exists){
            console.log("users.empty");
            throw new NotFoundError(`User not found`);
        }

        return {
            id: user.id,
            ...user.data()
        } as unknown as User;
    }catch(error){
        console.error(`Error while fetching user by id: ${id}`, error);
        throw error;
    }
}

export const findUserByUserName = async(username: string): Promise<User | null> => {
    try{
        const users = await db.collection("users").where("username", "==", username).get();
        
        if(users.empty){
            return null;
        }
        
        return {
            id: users.docs[0].id,
            ...users.docs[0].data()
        } as unknown as User;
    }catch(error){
        console.error(`Error while fetching user by username:${username}`, error);
        throw error;
    }
}

export const updateUserById = async (id: string, userDto: Partial<User>) => {
    try{
        await db.collection("users").doc(id).update({
            ...userDto,
            updatedAt: Date.now(),
        })
        return {
            ...userDto,
        }
    }catch(error){
        console.error("Error while updating user", error);
        throw error;
    }
}