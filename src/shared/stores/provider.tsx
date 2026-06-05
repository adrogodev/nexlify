"use client";

import { Provider } from "react-redux";
import { store } from ".";

interface Prop {
  children: React.ReactNode;
}

export const Providers = ({ children }: Prop) => {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  )
}
