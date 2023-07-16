import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next"
import Layout from '../components/layout'
import { get_user_from_email } from "../lib/database"
import { useRouter } from 'next/router'
import styles from '../styles/profile.module.css';

export default function Home( { user } ) {
  user = JSON.parse(user)
  const router = useRouter()
  const { msg } = router.query
  const rolesinfo={"Owner": "This user is the owner of this website!", "Moderator": "This User has the power to do anything!", "Helper": "This user has suggested a scenario and it has been verified!", "Tester": "This user has helped in testing out this website!", "Contributor": "This user has helped with this website's code!", "Early User": "This user is one of this website's first users!"}
  return (
    <Layout navbar="yes" moderator={user.roles.includes("Moderator")?"yes":"no"}>
      <>
        {user.roles.includes("Moderator") && <p>{user.username} has {user.warnings} warnings!</p>}
        <div className="flex_center flex_row">
            <h2>{user.username}'s Profile</h2>
            <img src={user.image} alt="Profile Pic" width="10%" height="10%" style={{borderRadius: "50%",marginLeft: "10px"}}/>
        </div>
        <div className="flex_row">
            { 
            user.roles.map((role, index) => ( 
                <div className={styles.tooltip}>{role}
                <span className={styles.tooltiptext}>{rolesinfo[role]}</span>
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
  return {
    props: {
      user: JSON.stringify(user),
    },
  }
}
