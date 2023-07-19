import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next"
import Layout from '../components/layout'
import { get_user_from_email } from "../lib/database"
import { useRouter } from 'next/router'
import { get_all_nvs } from "../lib/database";

export default function Home( { user, scenarios } ) {
  user = JSON.parse(user)
  scenarios = JSON.parse(scenarios)
  const router = useRouter()
  const { msg } = router.query
  return (
    <Layout navbar="yes" moderator={user.roles.includes("Moderator")?"yes":"no"}>
      <>
        {msg && <p><strong>{msg}</strong></p>}
        <h2>Mod Dashboard</h2>
        {scenarios.length == 0 && <p>There are no unverified scenarios!</p>}
        { 
          scenarios.map((scenario, index) => ( 
            <div id={index}>
                <p>{scenario.title}</p>
                <p>{scenario.desc}</p>
                <p>By: {scenario.username}</p>
                <a href={`/api/accept_scenario?id=${scenario._id}`}>Accept Scenario</a>
                <a href={`/api/decline_scenario?id=${scenario._id}`}>Decline Scenario</a>
            </div>
          ))
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

  if (user.roles.includes("Moderator") == false) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    }
  }

  const scenarios = await get_all_nvs()
  return {
    props: {
      user: JSON.stringify(user),
      scenarios: JSON.stringify(scenarios)
    },
  }
}
