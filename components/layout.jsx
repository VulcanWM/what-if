import Head from 'next/head';
import styles from './layout.module.css';

export const siteTitle = "What If";

export default function Layout({ navbar, moderator, children }) {
  return (
    <div>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta
          name="description"
          content="a website where you will face hypothetical scenarios (what if), and you can enter your thoughts for each of them"
        />
        <meta
          property="og:image"
          content="/logo.png"
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="og:site_name" content={siteTitle} />
        <meta name="robots" content="index, follow"/>
        <meta property="og:type" content="Website" />
        <title>{siteTitle}</title>
      </Head>
      {navbar == "yes" && 
        <div className={styles.topnav + " " + styles.flex_center + " " + styles.flex_row}>
          <a href="/">Dashboard</a>
          <a href="/profile">Your Profile</a>
          <a href="/new_scenario">New Scenario</a>
          {moderator == "yes" && <a href="/admin">Admin Page</a>}
        </div>
      }
      <main className={styles.flex_center + " " + styles.context}>
        {children}
      </main>
    </div>
  );
}
