import Head from 'next/head';
import styles from './layout.module.css';
import Link from 'next/link'

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
        <meta
          name="og:description"
          content="a website where you will face hypothetical scenarios (what if), and you can enter your thoughts for each of them"
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
          <Link href="/">Dashboard</Link>
          <Link href="/profile">Your Profile</Link>
          <Link href="/new_scenario">New Scenario</Link>
          {moderator == "yes" && <Link href="/mod">Mod Page</Link>}
        </div>
      }
      <main className={styles.flex_center + " " + styles.content}>
        {children}
      </main>
    </div>
  );
}
