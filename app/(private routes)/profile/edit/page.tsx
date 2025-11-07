"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import css from "./EditProfilePage.module.css";
import { checkSession, getMe, editMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

export default function EditProfilePage() {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated
  );

  const [newUsername, setNewUsername] = useState("");

  useEffect(() => {
    if (user) {
      setNewUsername(user.username || "");
      return;
    }

    const fetchUser = async () => {
      try {
        await checkSession();
        const fetchedUser = await getMe();
        if (fetchedUser) {
          setUser(fetchedUser);
          setNewUsername(fetchedUser.username || "");
        }
      } catch {
        clearIsAuthenticated();
      }
    };

    fetchUser();
  }, [user, setUser, clearIsAuthenticated]);

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewUsername(e.target.value);
  };

  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await editMe({ username: newUsername });
      if (user) {
        setUser({ ...user, username: newUsername });
      }
      router.push("/profile");
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (!user) return null;

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={user.avatar}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form onSubmit={handleSave} className={css.profileInfo}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              value={newUsername}
              onChange={handleUsernameChange}
              className={css.input}
            />
          </div>

          <p>Email: {user.email}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className={css.cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
