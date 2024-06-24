import React, { useEffect } from "react";
import { Navigate, Outlet, useLoaderData, useNavigate } from "react-router-dom";

const PrivateRoutes = () => {
  const user = useLoaderData();
  const navigate = useNavigate();
  useEffect(()=>{
    if(!user) navigate("/signin");
  }, [user?.uid]);
  return user ? <Outlet /> : <Navigate replace to="/signin" />;
};

export default PrivateRoutes;
