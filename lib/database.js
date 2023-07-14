import dbConnect from './mongodb'
import User from '../models/User'

// export async function set_user(username, image) {
//     await dbConnect()
//     const user = await User.create({username: username, image: image, todo: []})
//     return user
// }

export async function get_user_from_email(email) {
    await dbConnect()
    const users = await User.find({email: email})
    if (users.length == 0){
        return false
    } else {
        return users[0]
    }
}