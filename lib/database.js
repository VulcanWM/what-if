import dbConnect from './mongodb'
import User from '../models/User'
import Scenario from '../models/Scenario'
import NV_Scenario from '../models/NV_Scenario'
import Comment from '../models/Comment'

export async function create_user(email, username, image) {
    username = username.toLowerCase()
    await dbConnect()
    const user = await User.create({username: username, image: image, roles: ["Early User"], email: email, warnings: 0, posted: [], banned: false})
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

export async function get_nv_scenario_user(username) {
    await dbConnect()
    const nv_scenarios = await NV_Scenario.find({username: username})
    return nv_scenarios;
}

export async function add_scenario(title, desc, username) {
    await dbConnect()
    const nv_scenario = await NV_Scenario.create({title:title, desc:desc, username:username})
    return nv_scenario
}

export async function get_all_nvs() {
    await dbConnect()
    const all_nv_scenarios = await NV_Scenario.find({})
    return all_nv_scenarios;
}