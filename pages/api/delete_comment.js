import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
import { get_user_from_email, delete_comment } from "../../lib/database"

export default async (req, res) => {
  const session = await getServerSession(req, res, authOptions)
  if (req.method == 'GET') {
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
            const id = req.query.id
            const username = req.query.username;
            const func = await delete_comment(id, username)
            res.redirect(`/scenario/${id}?msg=${func}`)
        }
    } else {
        res.redirect("/")
    }
  } else {
    res.redirect("/")
  }
  res.end()
}