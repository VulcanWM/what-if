import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
import { get_user_from_email, accept_scenario } from "../../lib/database"

export default async (req, res) => {
  const session = await getServerSession(req, res, authOptions)
  if (req.method == 'GET') {
    if (session) {
        const email = session.user.email;
        const user = await get_user_from_email(email);
        if (user.roles.includes("Moderator") == false){
            res.redirect("/dashboard");
            return;
        } else {
            const id = req.query.id
            const func = await accept_scenario(id)
            res.redirect(`/admin?msg=${func}`)
        }
    } else {
        res.redirect("/")
    }
  } else {
    res.redirect("/")
  }
  res.end()
}