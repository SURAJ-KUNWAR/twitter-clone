import { getUserByUsername } from "../../db/users";
import bcrypt from "bcrypt";
import { generateTokens } from "../../utils/jwt";
import { userTransformer } from "../../transformers/users";
export default defineEventHandler(async(event) => {
    const body = await readBody(event);
    const {username , password} = body ;
     if (!username || !password){
        return sendError(event , createError(event , {
            status : 400,
            message : "invalid Params"
        }))
     }

    //if the user is registered 
    const user = await getUserByUsername(username);
    if (!user){
        return sendError(event , createError({
            status : 400 ,
            message : "Please enter correct username and password"
        }))
    }

    // does the password matches ?
    const doesThePasswordmatch = await bcrypt.compare(password,user.password)


    //create tokens
    //Access token
    //Refresh Token
    const {accessToken , refreshToken } = generateTokens(user);

    //Save it inside Db


    //Add http only cookie
      
    return {
        user : userTransformer(user),
        access_token : accessToken,
       
    }
})