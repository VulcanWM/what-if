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
    <Layout navbar="yes" moderator={user.roles.includes("Moderator")?"yes":"no"} pageTitle={"Mod Dashboard"}>
      <>
        {msg && <p><strong>{msg}</strong></p>}
        <h2>Mod Dashboard</h2>
        <form className='flex_center'  method="POST" action="/api/add_warning">
          <h3>Add Warnings</h3>
          <input placeholder="username" name="username" autocomplete="off" required/>
          <input placeholder="amount of warns" name="amount" type="number" autocomplete="off" required/>
          <button>Add Warnings</button>
        </form>
        <form className='flex_center' method="POST" action="/api/ban_user">
          <h3>Ban User</h3>
          <input placeholder="username" name="username" autocomplete="off" required/>
          <textarea id="reason" placeholder="reason" name="reason" rows="5" cols="40" defaultValue="they were being rude"/>
          <button>Ban User</button>
        </form>
        <form className='flex_center' method="POST" action="/api/unban_user">
          <h3>Unban User</h3>
          <input placeholder="username" name="username" autocomplete="off" required/>
          <button>Unban User</button>
        </form>
        {scenarios.length == 0 && <p>There are no unverified scenarios!</p>}
        <div id="scenarios">
          { 
            scenarios.map((scenario, index) => ( 
              <div id={index}>
                  <h4>{scenario.title}</h4>
                  <p>{scenario.desc}</p>
                  <p>By: <i>{scenario.username}</i></p>
                  <a className="marginRight" href={`/api/accept_scenario?id=${scenario._id}`}>Accept Scenario</a>
                  <a href={`/api/decline_scenario?id=${scenario._id}`}>Decline Scenario</a><br/><br/>
              </div>
            ))
          }
        </div>
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
