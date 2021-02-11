import Head from 'next/head';
import { Button, Icon, TopBar, Typography } from '@equinor/eds-core-react';
import { accessible, account_circle, fullscreen, notifications } from '@equinor/eds-icons';
import styles from './default.layout.module.scss';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import React from 'react';
import UserMenu from '../components/AppHeader/UserMenu';
import Link from 'next/link';
import { useRouter } from 'next/router';

const icons = {
  account_circle,
  accessible,
  notifications,
  fullscreen,
};

Icon.add(icons);

const DefaultLayout = ({ children }) => {
  const { instance, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const router = useRouter();

  const login = () => {
    router.push('/login');
  };

  return inProgress == 'none' ? (
    <>
      <Head>
        <title>Authentication Required</title>
        <meta charSet='utf-8' />
      </Head>

      <TopBar>
        <Link href={'/'}>
          <Typography className={styles.title} variant={'h4'}>
            VSM
          </Typography>
        </Link>
        <TopBar.Actions>
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <Button onClick={login} color='primary'>
              Login
            </Button>
          )}
        </TopBar.Actions>
      </TopBar>

      {children}
    </>
  ) : null;
};

export default DefaultLayout;
