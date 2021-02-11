import { Typography } from '@equinor/eds-core-react';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import { Layouts } from '../../layouts/LayoutWrapper';
import styles from '../../styles/common.module.scss';

export default function VSM() {
  return (
    <div className={styles.container}>
      <Head>
        <title>VSM</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Typography variant="h1">About 👨‍💻</Typography>{' '}
        <div style={{ padding: '2rem' }}>
          <Link href="/">
            <a>Home</a>
          </Link>
        </div>
      </main>
    </div>
  );
}

VSM.layout = Layouts.Default;
VSM.auth = true;
