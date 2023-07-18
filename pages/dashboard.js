import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next"
import Layout from '../components/layout'
import { get_user_from_email, get_all_scenarios } from "../lib/database"
import { useRouter } from 'next/router'
import { useState } from "react"
import styles from '../styles/dashboard.module.css';

export default function Home( { user, scenarios } ) {
  user = JSON.parse(user)
  scenarios = JSON.parse(scenarios)
  const router = useRouter()
  const { msg } = router.query

  const [sort, setSort] = useState("All")

  return (
    <Layout navbar="yes" moderator={user.roles.includes("Moderator")?"yes":"no"}>
      <>
        {msg && <p><strong>{msg}</strong></p>}
        <h2>Hello {user.username}</h2>
        <h2>All Scenarios</h2>
        <p>Sorted by {sort}</p>
        <div className={styles.dropdown}>
          <button className={styles.dropbtn}>Sort&#8595; 
            <i class="fa fa-caret-down"></i>
          </button>
          <div className={styles.dropdown_content}>
            <button onClick={() => setSort("All")}>Sort By All</button>
            <button onClick={() => setSort("Completed")}>Sort By Completed</button>
            <button onClick={() => setSort("Not Completed")}>Sort By Not Completed</button>
          </div>
        </div>
        <table>
          <tbody>
            <tr>
              <th>Title</th>
              <th>Done?</th>
            </tr>
            { 
              scenarios.map((scenario, index) => (
                <>
                  {sort == "All" && 
                    <tr id={index} style={{cursor: "pointer"}} onClick={() => {router.push(`/scenario/${scenario._id}`)}}>
                      <td>{scenario.title}</td>
                      {user.posted.includes(scenario._id) ? <td>Yes</td> : <td>No</td>}
                    </tr>
                  }
                  {sort == "Completed" && 
                    <>
                      {user.posted.includes(scenario._id) && 
                        <tr id={index} style={{cursor: "pointer"}} onClick={() => {router.push(`/scenario/${scenario._id}`)}}>
                          <td>{scenario.title}</td>
                          <td>Yes</td>
                        </tr>
                      }
                    </>
                  }
                  {sort == "Not Completed" && 
                    <>
                      {user.posted.includes(scenario._id) ? <></> : 
                        <tr id={index} style={{cursor: "pointer"}} onClick={() => {router.push(`/scenario/${scenario._id}`)}}>
                          <td>{scenario.title}</td>
                          <td>Yes</td>
                        </tr>
                      }
                    </>
                  }
                </>
              ))
            }
            </tbody>
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
