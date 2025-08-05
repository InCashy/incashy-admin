import React from 'react'
import DashboardPage from "@/components/dashboard/page"


export const metadata = {
  title: "Dashboard",
  description: "dashboard",
  alternates: {
    canonical: "https://www.incashy.com",
  }
};
const HomePage = () => {
  return (
    <DashboardPage></DashboardPage>
  )
}

export default HomePage