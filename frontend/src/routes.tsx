import React from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";

import Home from "./pages/home";
import { GetImage } from "./components/GetImage"

export default function Router() {
   return(
       <BrowserRouter>
           <Routes>
               <Route path="/" element={<Home />} />
               <Route path="/image/:id" element={<GetImage />} />
           </Routes>
       </BrowserRouter>
   )
}

