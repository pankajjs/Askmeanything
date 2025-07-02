import { db } from "../config/firestore"
import { User } from "../types";

export const findUserByEmail = async (email: string): Promise<User | null> => {
    try{
        const users =  await db.collection("users").where("email", '==', email).get();
        
        if(users.empty){
            return null;
        }

        return {
            id: users.docs[0].id,
            ...users.docs[0].data()
        } as User;
    }catch(error){
        console.error("(findUserByEmail): Error while fetching user by email", error)
        throw error;
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
            createdAt: Date.now(),
            updatedAt: Date.now(),
            active: true,
            status: "Ask some interesting question huh:)"
        })

        return {
            id: user.id,
            ...(await user.get()).data(),
        } as User;
    }catch(error){
        console.error("(createUser): Error while creating user", error);
        throw error;
    }
}

export const findUserById = async (id: string): Promise<User | null> => {
    try{
        const user = await db.collection("users").doc(id).get();
        
        if(!user.exists){
            return null;
        }

        return {
            id: user.id,
            ...user.data()
        } as User;
    }catch(error){
        console.error(`(findUserById): Error while fetching user by id: ${id}`, error);
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
        } as User;
    }catch(error){
        console.error(`(findUserByUserName): Error while fetching user by username:${username}`, error);
        throw error;
    }
}

export const updateUserById = async (id: string, userDto: Partial<User>) => {
    try{
        userDto = {...userDto, updatedAt: Date.now()}

        await db.collection("users").doc(id).update({
            ...userDto,
        })

        return {
            ...userDto,
        }
    }catch(error){
        console.error("(updateUserById): Error while updating user", error);
        throw error;
    }
}