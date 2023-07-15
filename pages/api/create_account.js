import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
import { get_user, create_user, get_user_from_email } from "../../lib/database"

export default async (req, res) => {
  const session = await getServerSession(req, res, authOptions)
  if (req.method == 'POST') {
    if (session) {
        const email = session.user.email;
        const image = session.user.image;
        const username = req.body.username;
        const email_exists = await get_user_from_email(email);
        if (email_exists){
            res.redirect("/dashboard");
        } else {
            const username_exists = await get_user(username)
            if (username_exists){
                // redirect with error that shows that username has been taken
            } else {
                create_user(email, username, image)
                res.redirect("/intro")
            }
        }
    } else {
        res.redirect("/")
    }
  } else {
    res.redirect("/")
  }
  res.end()
}