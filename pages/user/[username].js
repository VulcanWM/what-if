import { authOptions } from "./../api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next"
import Layout from '../../components/layout'
import { get_user, get_user_from_email, get_all_scenarios } from "../../lib/database"
import styles from '../../styles/profile.module.css';
import { useRouter } from 'next/router'

export default function Home( { user, document, scenarios } ) {
  user = JSON.parse(user)
  document = JSON.parse(document)
  scenarios = JSON.parse(scenarios);
  
  const router = useRouter()
  const rolesinfo={"Owner": "This user is the owner of this website!", "Moderator": "This User has the power to do anything!", "Helper": "This user has suggested a scenario and it has been verified!", "Tester": "This user has helped in testing out this website!", "Contributor": "This user has helped with this website's code!", "Early User": "This user is one of this website's first users!"}
  return (
    <Layout navbar="yes" moderator={user.roles.includes("Moderator")?"yes":"no"}>
      <>
        {document.banned != false ? <h3>{document.username} has been banned for {document.banned}</h3>: 
          <>
            {user.roles.includes("Moderator") && <p>{document.username} has {document.warnings} warnings!</p>}
            <div className="flex_center flex_row">
                <h2>{document.username}'s Profile</h2>
                <img src={document.image} alt="Profile Pic" width="10%" height="10%" style={{borderRadius: "50%",marginLeft: "10px"}}/>
            </div>
            <div className="flex_row">
                { 
                  document.roles.map((role, index) => ( 
                    <div id={index} className={styles.tooltip}>{role}
                      <span className={styles.tooltiptext}>{rolesinfo[role]}</span>
                    </div>
                  ))
                }
            </div>
            <h3>All of {document.username}'s completed scenarios</h3>
            <table>
                <tbody>
                    <tr>
                        <th>Title</th>
                    </tr>
                    { 
                        scenarios.map((scenario, index) => ( 
                            <>
                                {document.posted.includes(scenario._id) && 
                                    <tr style={{cursor: "pointer"}} onClick={() => {router.push(`/scenario/${scenario._id}`)}}>
                                        <td>{scenario.title}</td>
                                    </tr> 
                                }
                            </>
                        ))
                    }
                </tbody>
            </table>
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

  const document = await get_user(context.params.username)
  if (!document){
    return {
        redirect: {
          destination: '/dashboard',
          permanent: false,
        },
      }
  }

  const scenarios = await get_all_scenarios()

  return {
    props: {
      user: JSON.stringify(user),
      document: JSON.stringify(document),
      scenarios: JSON.stringify(scenarios)
    },
  }
}
