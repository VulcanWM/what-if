import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next"
import { signOut } from "next-auth/react";
import Layout from '../components/layout'
import { get_user_from_email } from "../lib/database"
import { useState } from React

export default function Home( { user } ) {
  user = JSON.parse(user)
  const [page, setPage] = useState(1)
  return (
    <Layout>
        <h4>Signed in as <strong>{user.username}</strong></h4>
        <button onClick={() => signOut()}>Sign out</button>
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
