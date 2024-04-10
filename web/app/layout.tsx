'use client';
import {API_SERVICE_CONTEXT} from "@/hooks/useApiService";
import ApiService from "@/service/ApiService";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <API_SERVICE_CONTEXT.Provider value={new ApiService()}>
          {children}
        </API_SERVICE_CONTEXT.Provider>
      </body>
    </html>
  )
}
