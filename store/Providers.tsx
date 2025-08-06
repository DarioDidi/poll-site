'use client';

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "@/store/store";

import { ThemeProvider } from "next-themes";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={store}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </Provider>
  );
}

export default Providers;
