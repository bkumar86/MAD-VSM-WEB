import Head from 'next/head';
import commonStyles from '../styles/common.module.scss';
import { Typography } from '@equinor/eds-core-react';
import Link from 'next/link';
import { Layouts } from '../layouts/LayoutWrapper';

export default function Home() {

  return (
    <div className={commonStyles.container}>
      <Head>
        <title>Startpage</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={commonStyles.main}>
        <Typography variant='h1'>This is the awesome startpage 🎉</Typography>

        <div style={{ padding: '2rem' }}>
          <Link href='/project'>
            <a>Projects</a>
          </Link>
        </div>
      </main>
    </div>
  );
}

Home.layout = Layouts.Default;
