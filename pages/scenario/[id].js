import { authOptions } from "./../api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next"
import Layout from '../../components/layout'
import { get_user_from_email, get_scenario } from "../../lib/database"

export default function Home( { user, scenario } ) {
  user = JSON.parse(user)
  scenario = JSON.parse(scenario)
  return (
    <Layout navbar="yes" moderator={user.roles.includes("Moderator")?"yes":"no"}>
      <>
        <h2>{scenario.title}</h2>
        <p>{scenario.desc}</p>
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

  const id = context.params.id;
  const scenario = await get_scenario(id)
  if (!scenario){
    return {
        redirect: {
          destination: '/dashboard',
          permanent: false,
        },
      }
  }

  return {
    props: {
      user: JSON.stringify(user),
      scenario: JSON.stringify(scenario)
    },
  }
}
