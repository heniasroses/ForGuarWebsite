"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

type Props = {
  openAuth: () => void;
};

export default function NavbarProfile({
  openAuth,
}: Props) {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setOpen(false);
    router.push("/");
    router.refresh();
  };

  if (!user) {
    return (
      <button
        className="navAuthButton"
        onClick={openAuth}
      >
        SIGN IN
      </button>
    );
  }

  const username =
    user.user_metadata?.username ||
    user.email?.split("@")[0] ||
    "User";

  const initial = username.charAt(0).toUpperCase();

  return (
    <div style={{ position: "relative" }}>
      <div
        className="navProfile"
        onClick={() => setOpen(!open)}
      >
        <div className="navAvatar">
          {initial}
        </div>

        <span className="navUsername">
          {username}
        </span>
      </div>

      {open && (
        <div className="profileDropdown">
          {/* 
          <div className="dropdownItem">
            View Profile
          </div>
          */}
          <div
            className="dropdownLogout"
            onClick={logout}
          >
            Log Out
          </div>

        </div>
      )}
    </div>
  );
}