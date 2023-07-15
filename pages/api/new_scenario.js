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
            if (user.banned == true){
                res.redirect("/dashboard");
                return;
            }
            const nv_scenarios = await get_nv_scenario_user(username);
            if (nv_scenarios.length > 5){
                res.redirect("/dashboard?msg=You cannot have more than 5 unverified scenarios!")
                return;
            }
            const title = req.body['title'];
            const desc = req.body['desc'];
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