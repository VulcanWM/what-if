import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
import { get_user_from_email, add_scenario, get_nv_scenario_user } from "../../lib/database"

export default async (req, res) => {
  const session = await getServerSession(req, res, authOptions)
  if (req.method == 'POST') {
    if (session) {
        const email = session.user.email;
        const user = await get_user_from_email(email);
        const username = user.username;
        if (user){
            if (user.banned != false){
                res.redirect("/dashboard");
                return;
            }
            const nv_scenarios = await get_nv_scenario_user(username);
            if (nv_scenarios.length >= 5){
                res.redirect("/dashboard?msg=You cannot have more than 5 unverified scenarios!")
                return;
            }
            const title = req.body['title'].trim();
            const desc = req.body['desc'].trim();
            if (title.length < 3){
              res.redirect("/dashboard?msg=Your scenario title needs to have at least 3 characters!")
              return;
            }
            if (desc.length < 3){
              res.redirect("/dashboard?msg=Your scenario description needs to have at least 3 characters!")
              return;
            }
            if (title.length > 60){
              res.redirect("/dashboard?msg=Your scenario title cannot have more than 60 characters!")
              return;
            }
            if (desc.length > 250){
              res.redirect("/dashboard?msg=Your scenario description cannot have more than 250 characters!")
              return;
            }
            await add_scenario(title, desc, username)
            res.redirect("/dashboard?msg=This scenerio is now waiting for verification!")
        } else {
            res.redirect("/create_account")
        }
    } else {
        res.redirect("/")
    }
  } else {
    res.redirect("/new_scenario")
  }
  res.end()
}