/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Head from "next/head";
import { useRouter } from "next/router";
import avatar from "../public/avatar.png";
import Navbar from "@/components/navbar-profile";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Profile = () => {
  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const [username, setUsername] = useState("");
  const [originalUsername, setOriginalUsername] = useState("");
  const [originalTitle, setOriginalTitle] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [edit, setEdit] = useState(false);
  const [password, setPassword] = useState("");
  const router = useRouter();
  const passwordValid =
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSignedIn(!!session);
      setLoading(false);
    };
    getUser();
    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSignedIn(!!session);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert(error.message);
      return;
    }
    setSignedIn(false);
    router.push("/");
  }

  async function getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from("users")
        .select("first_name, email, title")
        .eq("id", user.id)
        .single();
      if (data) {
        setUsername(data.first_name);
        setEmail(data.email);
        setTitle(data.title);
        setOriginalTitle(data.title);
        setOriginalUsername(data.first_name);
      }
      setLoading(false);
    }
  }

  async function updateUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const updates: { [key: string]: any } = {};
      if (username) updates["first_name"] = username;
      if (title) updates["title"] = title;

      const { error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", user.id);
      if (error) {
        alert(error.message);
      }

      if (password) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: password,
        });
        if (passwordError) {
          alert(passwordError.message);
        }
      }
    }
  }

  if (loading) return <p>Loading...</p>;

  if (!signedIn) {
    router.push("/");
    return null;
  }

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <Navbar />
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-bl from-primary-50 to-primary-400">
        <div className="flex flex-col bg-background text-text min-w-[50dvw] max-w-[100dvw] h-fit shadow-2xl p-8 rounded-xl items-center">
          <div>
            <h1 className="text-4xl font-bold mb-4 text-center">Profile</h1>
            <img
              src={avatar.src}
              alt="user"
              className="w-[150px] self-center justify-self-center"
            />
            <div className="mb-4">
              <label className="block text-md font-medium">Name</label>
              {edit ? (
                <input
                  className="border p-2 rounded w-full"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              ) : (
                <p className="text-xl font-light">{username}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-md font-medium">Email</label>
              {edit ? (
                <p className="text-xl font-light border p-2 rounded w-full">
                  {email}
                </p>
              ) : (
                <p className="text-xl font-light">{email}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-md font-medium">Title</label>
              {edit ? (
                <Select
                  onValueChange={(value) => {
                    switch (value) {
                      case "registered_dietician":
                        setTitle("Registered Dietician");
                        break;
                      case "dietician_technician":
                        setTitle("Dietician Technician");
                        break;
                      case "advanced_practice_provider":
                        setTitle("Advanced Practice Provider");
                        break;
                      case "nurse":
                        setTitle("Nurse");
                        break;
                      case "physician":
                        setTitle("Physician");
                        break;
                    }
                  }}
                >
                  <SelectTrigger className="w-full bg-white rounded text-text px-4 py-2">
                    <SelectValue placeholder="Select an occupation" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectGroup className="bg-white">
                      <SelectItem
                        className="w-full bg-white rounded text-text px-4 py-2 hover:bg-primary"
                        value="registered_dietician"
                      >
                        Registered Dietician
                      </SelectItem>
                      <SelectItem
                        className="w-full bg-white rounded text-text px-4 py-2 hover:bg-primary"
                        value="dietician_technician"
                      >
                        Dietician Technician
                      </SelectItem>
                      <SelectItem
                        className="w-full bg-white rounded text-text px-4 py-2 hover:bg-primary"
                        value="advanced_practice_provider"
                      >
                        Advanced Practice Provider
                      </SelectItem>
                      <SelectItem
                        className="w-full bg-white rounded text-text px-4 py-2 hover:bg-primary"
                        value="nurse"
                      >
                        Nurse
                      </SelectItem>
                      <SelectItem
                        className="w-full bg-white rounded text-text px-4 py-2 hover:bg-primary"
                        value="physician"
                      >
                        Physician
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-xl font-light">{title}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-md font-medium">Password</label>
              {edit ? (
                <input
                  className="border p-2 rounded w-full"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              ) : (
                <p className="text-lg font-light">●●●●●●●●●</p>
              )}
            </div>
            <div className="flex flex-row">
              <button
                onClick={() => {
                  setEdit(!edit);
                  setUsername(originalUsername);
                  setTitle(originalTitle);
                  setPassword("");
                }}
                className="bg-primary-500 text-white px-4 py-2 rounded w-[20dvw]"
              >
                {edit ? "Cancel" : "Edit"}
              </button>
              <button
                className={`${
                  edit ? "block ml-2" : "hidden"
                } bg-primary-500 text-white px-4 py-2 rounded w-[20dvw]`}
                onClick={() => {
                  if (passwordValid || password.length === 0) {
                    updateUser();
                    setEdit(false);
                  } else
                    alert(
                      "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
                    );
                }}
              >
                Save
              </button>
              <button
                onClick={handleSignOut}
                className={`${
                  edit ? "hidden" : "block"
                } bg-red-600 text-white px-4 py-2 rounded ml-2 w-[20dvw]`}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
