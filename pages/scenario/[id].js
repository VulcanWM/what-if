import { authOptions } from "./../api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next"
import Layout from '../../components/layout'
import { get_user_from_email, get_scenario, get_all_comments } from "../../lib/database"
import { useRouter } from 'next/router'

export default function Home( { user, scenario, comments } ) {
  user = JSON.parse(user)
  scenario = JSON.parse(scenario)
  comments = JSON.parse(comments)
  const router = useRouter()
  const { msg } = router.query
  const colors = ["#1e2938", "#304769", "#29426b"]
  return (
    <Layout navbar="yes" moderator={user.roles.includes("Moderator")?"yes":"no"}>
      <>
        {msg && <p><strong>{msg}</strong></p>}
        <h2>{scenario.title}</h2>
        <p>{scenario.desc}</p>
        {user.posted.includes(scenario._id) ? 
        <>
            <h3>Comments</h3>
            {comments.length == 0 && <p>There are no comments!</p>}
            { 
              comments.map((comment, index) => ( 
                <div className="comment flex_center" id={index} style={{backgroundColor: colors[(index % 3)]}}>
                    <p>{comment.body}</p>
                    {user.username == comment.username ? <p>By <a href="/profile">you</a></p> : <p>By <a href={`/user/${comment.username}`}>{comment.username}</a></p>}
                    <br/>
                    {user.roles.includes("Moderator") && <a href={`/api/delete_comment?id=${scenario._id}&username=${comment.username}`}>↑Delete Comment↑</a>}
                </div>
              ))
            }
        </>
        :<>
            <form className='flex_center' method='POST' action={`/api/post_comment?id=${scenario._id}`}>
                <textarea id="comment" placeholder="comment (max length: 300 characters)" name="comment" rows="15" cols="40"></textarea>
                <br/>
                <button >Post Comment</button>
            </form>
        </>
        }
      </>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions)
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  const session_user = session.user;
  const email = session_user.email
  const user = await get_user_from_email(email)

  if (!user) {
    return {
      redirect: {
        destination: '/create_account',
        permanent: false,
      },
    }
  }

  if (user.banned != false){
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    }
  }

  const id = context.params.id;
  const scenario = await get_scenario(id)
  if (!scenario){
    return {
        redirect: {
          destination: '/dashboard',
          permanent: false,
        },
      }
  }

  const comments = await get_all_comments(id)

  return {
    props: {
      user: JSON.stringify(user),
      scenario: JSON.stringify(scenario),
      comments: JSON.stringify(comments)
    },
  }
}
