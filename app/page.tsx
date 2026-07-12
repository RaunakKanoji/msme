import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return <main className={styles.simplePage}>
    <header className={styles.header}>
      <Link className={styles.brand} href="/"><span>360</span> MSME Arogya360</Link>
      <Show when="signed-in"><UserButton /></Show>
    </header>
    <section className={styles.card} aria-labelledby="welcome-title">
      <p>IDBI Innovate 2026</p>
      <h1 id="welcome-title">Welcome to MSME Arogya360</h1>
      <span>Sign in or create an account to open the secure dashboard.</span>
      <div className={styles.actions}>
        <Show when="signed-out">
          <SignInButton><button>Sign in</button></SignInButton>
          <SignUpButton><button className={styles.secondary}>Create account</button></SignUpButton>
        </Show>
        <Show when="signed-in"><Link href="/app">Open dashboard</Link></Show>
      </div>
    </section>
  </main>;
}
