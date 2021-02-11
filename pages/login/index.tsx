import { useIsAuthenticated, useMsal, useMsalAuthentication } from '@azure/msal-react';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { loginRequest, msalConfig } from '../../Config';
import { InteractionType } from '@azure/msal-browser';
import commonStyles from '../../styles/common.module.scss';
import Link from 'next/link';
import { Button, Typography } from '@equinor/eds-core-react';

export default function LoginPage() {
  const isAuthenticated = useIsAuthenticated();
  const { asPath } = useRouter();
  const router = useRouter();

  //Todo: Fix that we show an error message if we couldn't login instead of login-l♾p
  const { error } = useMsalAuthentication(
    InteractionType.Redirect,
    {
      scopes: loginRequest.scopes,
      authority: msalConfig.auth.authority,
    },
  );

  const redirectUrl = asPath.split('=')[1];
  useEffect(() => {
    if (isAuthenticated && !!redirectUrl) router.push(redirectUrl);
  }, [isAuthenticated]);

  if (isAuthenticated) {
    return (<div className={commonStyles.main}>
      <Typography variant={'h2'}>You are logged in</Typography>
      <Link href={'/'}>
        <Button>Go home</Button>
      </Link>
    </div>);
  }
  if (error)
    return (
      <div className={commonStyles.main}>
        <div className={'appear centerText'}>
          <Typography variant={'h2'}>Failed to login</Typography>
          <p>{JSON.stringify(error)}</p>
        </div>
      </div>
    );
  return (
    <div className={commonStyles.main}>
      <Typography variant={'h2'}>Logging you in...</Typography>
    </div>
  );
}
