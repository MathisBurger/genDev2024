'use client';
import {API_SERVICE_CONTEXT} from "@/hooks/useApiService";
import ApiService from "@/service/ApiService";
import {SnackbarProvider} from "notistack";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SnackbarProvider maxSnack={5} anchorOrigin={{ horizontal: "right", vertical: "bottom" }}>
            <div>
                <API_SERVICE_CONTEXT.Provider value={new ApiService()}>
                    {children}
                </API_SERVICE_CONTEXT.Provider>
            </div>
        </SnackbarProvider>
      </body>
    </html>
  )
}
