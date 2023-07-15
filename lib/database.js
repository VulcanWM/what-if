import dbConnect from './mongodb'
import User from '../models/User'

export async function create_user(email, username, image) {
    username = username.toLowerCase()
    await dbConnect()
    const user = await User.create({username: username, image: image, roles: ["Early User"], email: email, warnings: 0, posted: []})
    return user
}

export async function get_user_from_email(email) {
    await dbConnect()
    const users = await User.find({email: email})
    if (users.length == 0){
        return undefined;
    } else {
        return users[0]
    }
}

export async function get_user(username) {
    username = username.toLowerCase()
    await dbConnect()
    const users = await User.find({username: username})
    if (users.length == 0){
        return undefined;
    } else {
        return users[0]
    }
}