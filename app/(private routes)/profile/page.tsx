import Link from "next/link";
import css from "./ProfilePage.module.css";
import Image from "next/image";
import { Metadata } from "next";
import { getMeServer } from "@/lib/api/serverApi";

export async function generateMetadata(): Promise<Metadata> {
  const user = await getMeServer();
  return {
    title: `Note Hub. ${user.username}Profile Page`,
    description: `${user.username} own profile for creating notes`,
    openGraph: {
      title: `Note Hub. ${user.username}Profile Page`,
      description: `${user.username} own profile for creating notes`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: `${user.username} Avatar`,
        },
      ],
    },
  };
}
export default async function Profile() {
  const user = await getMeServer();
  if (!user) {
    return (
      <main className={css.mainContent}>
        <p>Please log in to see your profile.</p>
        <Link href="/sign-in">Go to Login</Link>
      </main>
    );
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>
        <div className={css.avatarWrapper}>
          <Image
            src="https://ac.goit.global/fullstack/react/default-avatar.jpg"
            alt={user.username}
            width={150}
            height={150}
            className={css.avatar}
            priority
          />
        </div>
        <div className={css.profileInfo}>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}
