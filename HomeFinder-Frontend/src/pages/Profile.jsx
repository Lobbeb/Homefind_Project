import { useSelector } from "react-redux";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div
      className="p-6 max-w-lg mx-auto my-8 rounded-lg shadow"
      style={{ backgroundColor: "rgba(229, 231, 235, 0.85)" }}
    >
      <h1 className="text-3xl font-bold text-center my-8">Profile Page</h1>
      <form className="flex flex-col gap-3">
        <img
          src={currentUser.avatar}
          alt="profile"
          className="rounded-full w-20 h-20 object-cover cursor-pointer self-center mt-3 mb-3"
        />
        <input
          type="text "
          placeholder="Username"
          className="border p-3 rounded-lg"
        ></input>
        <input
          type="text "
          placeholder="Password"
          className="border p-3 rounded-lg"
        ></input>
        <input
          type="text "
          placeholder="Email"
          className="border p-3 rounded-lg"
        ></input>
        <button className="bg-blue-700 text-white font-semibold rounded-lg p-3 uppercase hover:opacity-90 disabled:bg-gray-500 disabled:hover:opacity-100">
          Update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="cursor-pointer hover:underline">delete account</span>
        <span className="cursor-pointer hover:underline">sign out</span>
      </div>
    </div>
  );
}
