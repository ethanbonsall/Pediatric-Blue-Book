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
import { Eye, EyeOff } from "lucide-react";

const Profile = () => {
  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
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

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This cannot be undone."
    );
    if (!confirmDelete) return;

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      alert("Unable to find user session.");
      return;
    }

    const userId = user.id;

    const { error: profileError } = await supabase
      .from("users")
      .delete()
      .eq("id", userId);

    if (profileError) {
      alert("Error deleting profile: " + profileError.message);
      return;
    }

    const res = await fetch("/api/delete-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    const json = await res.json();
    if (json.error) {
      alert("Error deleting auth user: " + json.error);
      return;
    }

    handleSignOut();
  };

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
        <div className="flex flex-col bg-background text-text min-w-[80dvw] md:min-w-[20dvw] max-w-[100dvw] h-fit shadow-2xl p-8 rounded-xl  text-start">
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
              <p className="text-xl font-light w-full">{email}</p>
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
                  <SelectValue placeholder={originalTitle} />
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
              <div className="relative">
                <input
                  className="border p-2 rounded w-full pr-10"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2
              text-gray-600 hover:text-gray-900
              transition-all duration-200
              ease-out
              active:scale-100"
                >
                  {showPassword ? <Eye /> : <EyeOff />}
                </button>
              </div>
            ) : (
              <p className="text-lg font-light">●●●●●●●●●</p>
            )}
          </div>

          <div className="flex flex-row justify-center">
            <button
              onClick={() => {
                setEdit(!edit);
                setUsername(originalUsername);
                setTitle(originalTitle);
                setPassword("");
              }}
              className="bg-primary-500 text-white px-4 py-2 rounded w-[12dvw] min-w-fit"
            >
              {edit ? "Cancel" : "Edit"}
            </button>
            <button
              className={`${
                edit ? "block ml-2" : "hidden"
              } bg-primary-500 text-white px-4 py-2 rounded w-[12dvw] min-w-fit`}
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
              } bg-gray-700 text-white px-4 py-2 rounded ml-2 w-[12dvw] min-w-fit`}
            >
              Logout
            </button>
          </div>
          <div className="w-full flex items-center justify-center mt-2">
            <button
              onClick={handleDeleteAccount}
              className={`${
                edit ? "hidden" : "block"
              } bg-red-600 hover:bg-red-700 text-white w-[12dvw] px-4 py-2 rounded ml-2`}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
