import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next"
import Layout from '../components/layout'
import { get_user_from_email } from "../lib/database"
import { useState } from "react"
import styles from '../styles/intro.module.css';
import { useRouter } from 'next/router'

export default function Home( { user } ) {
  user = JSON.parse(user)
  const [slide, setSlide] = useState(1)
  const router = useRouter()
  return (
    <Layout>
        <>
            {slide == 1 && 
            <>
                <h3>What If?</h3>
                <p>This is a website where you will face hypothetical scenarios (what if), and you can enter your thoughts for each of them.</p>
                <p>After you enter your thought, you will be able to view what other user's have said, and compare your thoughts to their's!</p>
                <button className={styles.next} onClick={()=> {setSlide(slide+1)}}>Next</button>
            </> 
            }
            {slide == 2 && 
            <>
                <h3>Rules</h3>
                <ol>
                    <li>Don't be mean or toxic</li>
                    <li>Don't swear</li>
                    <li>No hate speech/slurs</li>
                    <li>Do not attempt to bypass filters</li>
                    <li>Do not attempt to harass moderators for their decisions</li>
                    <li>No NSFW, politics, religion, or controversial topics</li>
                    <li>Enjoy and have fun</li>
                </ol>
                <button className={styles.next} onClick={()=> {setSlide(slide+1)}}>Next</button>
            </> 
            }
            {slide == 3 && 
            <>
                <h3>Support this project</h3>
                <p>Follow <a href="https://github.com/VulcanWM">@VulcanWM on GitHub</a> to see all the updates and how this project was made.</p>
                <button className={styles.next} onClick={()=> {router.push("/dashboard")}}>Start having fun!</button>
            </> 
            }
            <div className={styles.dot_container}>
                {slide == 1 ? 
                    <span className={styles.dot + " " + styles.active}/>
                : 
                    <span className={styles.dot}/>
                }
                {slide == 2 ? 
                    <span className={styles.dot + " " + styles.active}/>
                : 
                    <span className={styles.dot}/>
                }
                {slide == 3 ? 
                    <span className={styles.dot + " " + styles.active}/>
                : 
                    <span className={styles.dot}/>
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
