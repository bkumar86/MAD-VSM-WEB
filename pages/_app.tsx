import React from 'react';
import '../styles/globals.scss';
import LayoutWrapper from '../layouts/LayoutWrapper';
import AuthenticationProvider from '../auth/AuthenticationProvider';
import { StoreProvider } from 'easy-peasy';
import store from '../store/store';

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
