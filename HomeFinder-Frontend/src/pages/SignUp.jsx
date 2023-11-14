import { Link } from "react-router-dom";
export default function SignUp() {
  return (
    <div
      className="p-6 max-w-lg mx-auto my-8 rounded-lg shadow"
      style={{ backgroundColor: "rgba(229, 231, 235, 0.85)" }}
    >
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form className="flex flex-col gap-5">
        <input
          type="text"
          placeholder="username "
          className="border p-3 rounded-lg placeholder-black text-black"
          id="username"
        />
        <input
          type="text"
          placeholder="password"
          className="border p-3 rounded-lg placeholder-black text-black "
          id="password"
        />
        <input
          type="text"
          placeholder="email"
          className="border p-3 rounded-lg placeholder-black text-black "
          id="email"
        />
        <button className="bg-blue-900 text-white font-bold p-3 rounded-lg uppercase hover:opacity-90 disabled:bg-gray-500 disabled:hover:opacity-100">
          Sign Up
        </button>
      </form>
      <div className="flex gap-3 mt-5">
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
          <span className="text-blue-700 font-bold">Sign In</span>
        </Link>
      </div>
    </div>
  );
}
