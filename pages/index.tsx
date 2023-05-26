import Head from "next/head";
import styles from "@/styles/Home.module.css";

export default function Home() {
	return (
		<>
			<Head>
				<title>Frontend Mentor | Todo app</title>
				<meta name="description" content="Made by Loai Esam" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon-32x32.png" />
			</Head>
			<main className={styles.main}></main>
		</>
	);
}
