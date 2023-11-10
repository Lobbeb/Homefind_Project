import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-blue-900 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex-wrap">
            <span className="text-slate-100">Home</span>
            <span className="text-yellow-400">Find</span>
          </h1>
        </Link>

        <form className=" bg-slate-100 p-3 rounded-lg flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent placeholder-black focus:outline-none w-24 sm:w-64"
          />
          <FaSearch className="text-black" />
        </form>

        <ul className=" flex gap-4">
          <Link to="/">
            <li className="hidden sm:inline text-slate-100 font-bold hover:underline">
              Home
            </li>
          </Link>

          <Link to="/about">
            <li className="text-slate-100 font-bold hover:underline">About</li>
          </Link>

          <Link to="/SignIn">
            <li className="text-slate-100 font-bold hover:underline">
              {""}SignIn{" "}
            </li>
          </Link>

          <Link to="/Map">
            <li className="text-slate-100 font-bold hover:underline">Map</li>
          </Link>

          <Link to="/MortageCalculator">
            <li className="text-slate-100 font-bold hover:underline">
              Mortage Calculator
            </li>
          </Link>
        </ul>
      </div>
    </header>
  );
}
