"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import theme from "./theme";
import { ThemeProvider } from "@mui/material";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import SocketProvider from "@/socket/SocketProvider";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          <AppRouterCacheProvider>
            <Provider store={store}>
              <SocketProvider>

                <ThemeProvider theme={theme}>{children}</ThemeProvider>
              </SocketProvider>
            </Provider>
          </AppRouterCacheProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
