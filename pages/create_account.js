import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next"
import Layout from '../components/layout'
import { get_user_from_email } from "../lib/database"
import { useRouter } from 'next/router'

export default function Home( { session_user } ) {
  const router = useRouter()
  const { error } = router.query
  return (
    <Layout pageTitle="Create Account">
        {error && <p className="error">{error}</p>}
        <h4>Hello <strong>{session_user.email}</strong></h4>
        <p>For you to use this website, you need to give yourself a username</p>
        <form className='flex_center' action="/api/create_account" method='POST'>
            <input name="username" placeholder="username" maxlength="20" required/><br/>
            <input type="submit" value="Submit"/>
        </form>
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
  if (user) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    }
  }
  
  return {
    props: {
      session_user
    },
  }
}
