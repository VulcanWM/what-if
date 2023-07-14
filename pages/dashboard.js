import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next"
import { signOut } from "next-auth/react";
import Layout from '../components/layout'

export default function Home( { user } ) {
  return (
    <Layout>
        <h4>Signed in as <strong>{user.name}</strong></h4>
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
  const user = session.user;
  return {
    props: {
      user
    },
  }
}
