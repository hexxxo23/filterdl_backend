import Users from "../models/userModels.js";
import { authSchema } from "../helpers/validation_schemas.js";
import bcrypt from "bcrypt";

export const getUsers = async(req,res)=>{
    try {
        const users = await Users.findAll();
        res.json(users);       
    } catch (error) {
        console.log(error)
    }
}

export const Register = async(req,res)=>{
    // const {username,email,password,confPassword} = req.body;
    const result = await authSchema.validateAsync(req.body);
    const userName = await Users.findOne({
        username: result.username
    })
    const emailUser = await Users.findOne({
        email: result.email
    })
    if(result.username==userName.username){
        return res.status(400).json({msg:'Username Already used'})
    }
    if(result.email  ==emailUser.email){
        return res.status(400).json({msg:'email Already used'})
    } 
    if (result.password !== result.confPassword) {
        return res.status(400).json({msg:'Password and Confirm Password are not match'});
    }
    const salt = await bcrypt.genSalt();
    const hasPassword = await bcrypt.hash(result.password,salt);
    try {
        await Users.create({
            username :result.username,
            email:result.email,
            password:hasPassword
        });
        res.json({msg:'Register is Success'});
    } catch (error) {
        console.log(error);
    }
}