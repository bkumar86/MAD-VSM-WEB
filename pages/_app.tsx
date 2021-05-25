import React from "react";
import "../src/globals.scss";
import LayoutWrapper from "src/LayoutWrapper";
import AuthenticationProvider from "src/AuthenticationProvider";
import { StoreProvider } from "easy-peasy";
import store from "src/box/ClickHandler/VSMCanvas/store";
import App, { AppContext } from "next/app";

const MyApp = ({ Component, pageProps }) => {
  return (
    <StoreProvider store={store}>
      <AuthenticationProvider>
        <LayoutWrapper {...pageProps}>
          <Component {...pageProps} />
        </LayoutWrapper>
      </AuthenticationProvider>
    </StoreProvider>
  );
};

export default MyApp;

// Turning off Automatic static optimization. Because runtime environment variables via docker https://github.com/vercel/next.js/discussions/15651#discussioncomment-110494
MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);

  return { ...appProps };
};
