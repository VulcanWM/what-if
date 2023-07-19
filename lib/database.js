import dbConnect from './mongodb'
import User from '../models/User'
import Scenario from '../models/Scenario'
import NV_Scenario from '../models/NV_Scenario'
import Comment from '../models/Comment'
const { ObjectId } = require('mongodb');

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
    username = username.toLowerCase()
    await dbConnect()
    const nv_scenarios = await NV_Scenario.find({username: username})
    return nv_scenarios;
}

export async function add_scenario(title, desc, username) {
    username = username.toLowerCase()
    await dbConnect()
    const nv_scenario = await NV_Scenario.create({title:title, desc:desc, username:username})
    return nv_scenario
}

export async function get_all_nvs() {
    await dbConnect()
    const all_nv_scenarios = await NV_Scenario.find({})
    return all_nv_scenarios;
}

export async function get_all_scenarios() {
    await dbConnect()
    const all_scenarios = await Scenario.find({})
    return all_scenarios;
}

export async function get_nv_scenario(id) {
    await dbConnect()
    const scenarios = await NV_Scenario.find({_id: new ObjectId(id)})
    if (scenarios.length == 0){
        return undefined;
    } else {
        return scenarios[0]
    }
}

export async function get_max_id() {
    await dbConnect()
    const scenarios = await Scenario.find().sort({"_id": "desc"}).limit(1)
    if (scenarios.length == 0){
        return 0;
    } else {
        return scenarios[0]._id
    }
}

export async function add_role(username, role) {
    username = username.toLowerCase()
    await dbConnect()
    const user = await get_user(username)
    if (user.roles.includes(role) == false){
        const roles = user.roles;
        roles.push(role)
        await User.findOneAndUpdate({username: username}, {roles: roles})
    }
}

export async function accept_scenario(id) {
    await dbConnect()
    const nv_scenario = await get_nv_scenario(id);
    if (!nv_scenario){
        return "This scenario does not exist!";
    }
    const highest_id = await get_max_id()
    const title = nv_scenario.title;
    const desc = nv_scenario.desc;
    const username = nv_scenario.username;
    await NV_Scenario.deleteOne({_id:nv_scenario._id})
    await Scenario.create({_id: highest_id+1,title:title,desc:desc})
    await add_role(username, "Helper")
    return "This scenario has been accepted!"
}

export async function decline_scenario(id) {
    await dbConnect()
    const nv_scenario = await get_nv_scenario(id);
    if (!nv_scenario){
        return "This scenario does not exist!";
    }
    await NV_Scenario.deleteOne({_id:nv_scenario._id})
    return "This scenario has been declined!"
}

export async function get_scenario(id) {
    await dbConnect()
    const scenarios = await Scenario.find({_id: parseInt(id)})
    if (scenarios.length == 0){
        return undefined;
    } else {
        return scenarios[0]
    }
}

export async function get_all_comments(id) {
    await dbConnect()
    const comments = await Comment.find({post: parseInt(id)})
    return comments;
}

export async function post_comment(postid, comment, username) {
    username = username.toLowerCase()
    await dbConnect()
    const user = await get_user(username);
    if (user.banned != false){
        return "You are banned!"
    }
    const scenario = await get_scenario(postid);
    if (!scenario){
        return "This scenario does not exist!"
    }
    if (user.posted.includes(scenario._id)){
        return "You have already commented on this!"
    }
    if (comment.length > 300){
        return "Your thoughts have to be less than 100 characters!"
    }
    await Comment.create({post: scenario._id, username:username, body:comment})
    const posted = user.posted;
    posted.push(scenario._id)
    await User.findOneAndUpdate({username: username}, {posted: posted})
    return true;
}

export async function delete_comment(id, username) {
    username = username.toLowerCase()
    await dbConnect()
    const comment = await Comment.find({post: parseInt(id), username: username})
    if (comment.length == 0){
        return "This comment does not exist!"
    } else {
        await Comment.deleteOne({_id:comment[0]._id})
    }
    return "This comment has been deleted!"
}

export async function add_warning(username, amount) {
    username = username.toLowerCase()
    await dbConnect()
    const user = await get_user(username)
    if (!user){
        return "This username does not exist!"
    }
    var warnings = user.warnings;
    warnings += parseInt(amount)
    await User.findOneAndUpdate({username: username}, {warnings: warnings})
    return `You gave ${username} ${amount} warnings!`
}

export async function ban_user(username, reason) {
    username = username.toLowerCase()
    await dbConnect()
    const user = await get_user(username)
    if (!user){
        return "This username does not exist!"
    }
    if (user.banned != false){
        return `${username} is already banned!`
    }
    await User.findOneAndUpdate({username: username}, {banned: reason})
    const comments = await Comment.find({username: username})
    comments.forEach(async comment => {
        await Comment.deleteOne({_id: comment._id});
    });
    const nv_scenarios = await get_nv_scenario_user(username);
    nv_scenarios.forEach(async scenario => {
        await NV_Scenario.deleteOne({_id: scenario._id});
    });
    return `You banned ${username} for ${reason}!`
}

export async function unban_user(username) {
    username = username.toLowerCase()
    await dbConnect()
    const user = await get_user(username)
    if (!user){
        return "This username does not exist!"
    }
    if (user.banned == false){
        return `${username} is already not banned!`
    } else {
        await User.findOneAndUpdate({username: username}, {banned: false});
        return `You unbanned ${username}!`
    }
}