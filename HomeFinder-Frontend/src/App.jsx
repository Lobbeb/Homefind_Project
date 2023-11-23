import { BrowserRouter, Routes, Route } from "react-router-dom";

import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Map from "./pages/Map";
import About from "./pages/about";
import Header from "./Components/Header";
import MortageCalculator from "./pages/MortageCalculator";
import Profile from "./pages/Profile";
import PrivateRoute from "./Components/PrivateRoute";
import CreateListing from "./pages/CreateListing";
import UpdateListing from "./pages/UpdateListing";
import Listing from "./pages/Listing";
import Search from "./pages/Search";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />

        <Route path="/search" element={<Search />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/About" element={<About />} />
        <Route path="/listing/:listingId" element={<Listing />} />

        {/* Encapsulated and made profile private*/}
        <Route element={<PrivateRoute />}>
          <Route path="/Profile" element={<Profile />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route
            path="/update-listing/:listingId"
            element={<UpdateListing />}
          />
        </Route>

        <Route path="/Map" element={<Map />} />
        <Route path="/MortageCalculator" element={<MortageCalculator />} />
      </Routes>
    </BrowserRouter>
  );
}
