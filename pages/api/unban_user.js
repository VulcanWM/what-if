import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
import { get_user_from_email, unban_user } from "../../lib/database"

export default async (req, res) => {
  const session = await getServerSession(req, res, authOptions)
  if (req.method == 'POST') {
    if (session) {
        const email = session.user.email;
        const user = await get_user_from_email(email);
        if (!user){
          res.redirect("/create_account");
          return;
        }
        if (user.roles.includes("Moderator") == false){
            res.redirect("/dashboard");
            return;
        } else {
            const username = req.body.username;
            const func = await unban_user(username)
            res.redirect(`/mod?msg=${func}`)
        }
    } else {
        res.redirect("/")
    }
  } else {
    res.redirect("/mod")
  }
  res.end()
}