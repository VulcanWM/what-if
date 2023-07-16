import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next"
import Layout from '../components/layout'
import { get_user_from_email } from "../lib/database"

export default function Home( { user } ) {
  user = JSON.parse(user)
  return (
    <Layout navbar="yes" moderator={user.roles.includes("Moderator")?"yes":"no"}>
      <>
      <h2>Create a new scenario</h2>
        <p>If your scenario gets accepted, you'll get the Helper role!</p>
        <form className='flex_center' method="POST" action="/api/new_scenario">
            <input placeholder="title" name="title" autoComplete="off" required/><br/>
            <textarea id="desc" placeholder="description" name="desc" rows="10" cols="40"></textarea><br/>
            <button>Create scenario</button>
        </form>
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
  return {
    props: {
      user: JSON.stringify(user),
    },
  }
}
