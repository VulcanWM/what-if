import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
import { get_user_from_email, post_comment } from "../../lib/database"
import { profanity } from '@2toad/profanity';

export default async (req, res) => {
  const session = await getServerSession(req, res, authOptions)
  if (req.method == 'POST') {
    if (session) {
        const email = session.user.email;
        const user = await get_user_from_email(email);
        if (!user){
            res.redirect("/create_account")
            return;
        }
        if (user.banned != false){
          res.redirect("/dashboard");
          return;
       }
        const id = req.query.id
        const comment = req.body.comment.trim();
        if (comment.length == 0){
            res.redirect(`/scenario/${id}?msg=You need to input something for your thought!`)
            return;
        }
        const func = await post_comment(id, profanity.censor(comment), user.username)
        if (func == true){
            res.redirect(`/scenario/${id}`)
        } else {
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