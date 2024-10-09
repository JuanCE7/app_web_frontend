"use client";
import { useSession } from "next-auth/react";

const Dashboard = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  // const getCats = async () => {
  //   const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cats`, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${session?.user?.token}`,
  //     },
  //   });
  //   const data = await res.json();
  //   console.log(data);
  // };
  
  return (
    <div>
      <h1 className="text-2xl mb-4">Dashboard</h1>
      <div className="grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3"></div>
      
    </div>
  );
};
export default Dashboard;