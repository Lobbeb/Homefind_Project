import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value }); // e.target.id is the id of the input field
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null); //If we get error and then we submit again with no error, we want to remove the error message from the screen
      navigate("/"); //TODO: Either we keep it as default aka homepage or we direct to our profile page.
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };
  return (
    <div
      className="p-6 max-w-lg mx-auto my-8 rounded-lg shadow"
      style={{ backgroundColor: "rgba(229, 231, 235, 0.85)" }}
    >
      <h1 className="text-3xl text-center font-semibold my-7">Please Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg placeholder-black text-black "
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg placeholder-black text-black "
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-blue-900 text-white font-bold p-3 rounded-lg uppercase hover:opacity-90 disabled:bg-gray-500 disabled:hover:opacity-100"
        >
          {loading ? "Loading..." : "Sign in"}
        </button>
      </form>
      <div className="flex gap-3 mt-5">
        <p>Dont have an account?</p>
        <Link to={"/sign-up"}>
          <span className="text-blue-700 font-bold">Sign Up</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
}
