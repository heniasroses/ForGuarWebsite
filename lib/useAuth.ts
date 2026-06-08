"use client";

import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export type UserProfile = {
  id: string;
  role: string;
  username?: string;
};

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAuth = async () => {
      setLoading(true);

      const { data: authData } = await supabase.auth.getUser();
      const currentUser = authData.user;

      if (!currentUser) {
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      setUser(currentUser);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("id, role, username")
        .eq("id", currentUser.id)
        .single();

      setProfile(profileData || null);

      setLoading(false);
    };

    getAuth();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      getAuth();
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return { user, profile, loading };
}