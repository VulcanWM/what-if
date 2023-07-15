import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next"
import { signOut } from "next-auth/react";
import Layout from '../components/layout'
import { get_user_from_email } from "../lib/database"

export default function Home( { user } ) {
  user = JSON.parse(user)
  return (
    <Layout navbar="yes" moderator={user.roles.includes("Moderator")?"yes":"no"}>
      <>
        {/* <div class='flex-center content'>
            
      {% if text != None and text != False and text != "" %}
            <div class='flex-center msg'>
        <p>{{text}}</p>
            </div>
      {% endif %}
      <h1>Hello {{user_name}}!</h1>
      <h2>All Scenarios</h2>
      <div class="dropdown">
        <button class="dropbtn">Sort&#8595; 
          <i class="fa fa-caret-down"></i>
        </button>
        <div class="dropdown-content">
          <a href="/dashboard?sort=All">Sort By All</a>
          <a href="/dashboard?sort=Completed">Sort by Completed</a>
          <a href="/dashboard?sort=Not Completed">Sort by Not Completed</a>
        </div>
      </div>
      <p>Sorted by {{sort}}</p>
      <p>Click on the table rows to see the full scenario and comment!</p>
      <table>
        <tr>
    <!--       <th>Id</th> -->
          <th>Title</th>
          <th>Done?</th>
        </tr>
        {% for scenario in scenarios %}
          {% if sort == "All" %}
            <tr style='cursor: pointer;' onclick="window.location.href='/scenario/{{scenario['_id']}}'">
    <!--           <td>{{scenario['_id']}}</td> -->
              <td>{{scenario['Title']}}</td>
              {% if scenario['_id'] in document['Posted'] %}
                <td>Yes</td>
              {% else %}
                <td>No</td>
              {% endif %}
            </tr>
          {% elif sort == "Completed" %}
            {% if scenario['_id'] in document['Posted'] %}
              <tr style='cursor: pointer;' onclick="window.location.href='/scenario/{{scenario['_id']}}'">
                <td>{{scenario['Title']}}</td>
                <td>Yes</td>
              </tr>
            {% endif %}
          {% else %}
            {% if scenario['_id'] not in document['Posted'] %}
              <tr style='cursor: pointer;' onclick="window.location.href='/scenario/{{scenario['_id']}}'">
                <td>{{scenario['Title']}}</td>
                <td>No</td>
              </tr>
            {% endif %}
          {% endif %}

        {% endfor %}
      </table>
        </div> */}
        <h4>Signed in as <strong>{user.username}</strong></h4>
        <button onClick={() => signOut()}>Sign out</button>
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
