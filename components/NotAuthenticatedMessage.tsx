import { Button, Typography } from '@equinor/eds-core-react';
import Link from 'next/link';
import React from 'react';
import styles from '../styles/common.module.scss';
import { useRouter } from 'next/router';

const NotAuthenticatedMessage = () => {
  const { asPath: redirectUrl } = useRouter();
  return (
    <main className={styles.main}>
      <Typography variant='h1'>You must be logged in to see that... 😅</Typography>
      <Link href={`/login?redirect=${redirectUrl}`}>
        <Button>
          Login
        </Button>
      </Link>
    </main>
  );
};
export default NotAuthenticatedMessage;
