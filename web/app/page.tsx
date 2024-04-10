'use client';

import Sidebar from "@/components/Sidebar";
import AuthorizedLayout from "@/components/AuthorizedLayout";

const Page = () => {
  return (
      <AuthorizedLayout>
          <h1>Dashboard</h1>
      </AuthorizedLayout>
  );
}

export default Page;