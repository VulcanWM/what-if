import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next"
import Layout from '../components/layout'
import { get_user_from_email, get_all_scenarios } from "../lib/database"
import { useRouter } from 'next/router'

export default function Home( { user, scenarios } ) {
  user = JSON.parse(user)
  scenarios = JSON.parse(scenarios)
  const router = useRouter()
  const { msg } = router.query
  return (
    <Layout navbar="yes" moderator={user.roles.includes("Moderator")?"yes":"no"}>
      <>
        {msg && <p><strong>{msg}</strong></p>}
        <h2>Hello {user.username}</h2>
        <h2>All Scenarios</h2>
        <table>
          <tr>
            <th>Title</th>
            <th>Done?</th>
          </tr>
          { 
            scenarios.map((scenario, index) => (
              <tr style={{cursor: "pointer"}} onClick="window.location.href='/scenario/{{scenario['_id']}}'">
                <td>{scenario.title}</td>
                {user.posted.includes(scenario._id) ? <td>Yes</td> : <td>No</td>}
              </tr>
            ))
          }
        </table>
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

  const scenarios = await get_all_scenarios()

  return {
    props: {
      user: JSON.stringify(user),
      scenarios: JSON.stringify(scenarios)
    },
  }
}
