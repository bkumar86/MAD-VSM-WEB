import commonStyles from '../../styles/common.module.scss';
import Head from 'next/head';
import { Button, Icon, Typography } from '@equinor/eds-core-react';
import { Layouts } from '../../layouts/LayoutWrapper';
import { account_circle, add } from '@equinor/eds-icons';
import { VSMCard } from '../../components/Card/Card';
import BaseAPIServices from '../../services/BaseAPIServices';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useStoreDispatch } from '../../hooks/storeHooks';
import { vsmObjectTypes } from '../../types/vsmObjectTypes';
import { VsmProject } from '../../interfaces/VsmProject';

Icon.add({ account_circle, add });

function hideWhenNotLoading(loading: boolean | undefined) {
  if (loading) return '';
  return 'hidden';
}

function LoadingIndicator(props: { isLoading: boolean }) {
  const { isLoading } = props;
  return (
    <span className={`${hideWhenNotLoading(isLoading)} loading noselect`}>
      Loading...
    </span>
  );
}

export default function Project(props) {

  const [projects, setProjects] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();
  const dispatch = useStoreDispatch();

  useEffect(() => {
    setFetching(true);
    BaseAPIServices
      .get('/api/v1.0/project')
      .then(value => setProjects(value.data))
      .catch(reason => {
        setError(reason);
      })
      .finally(() => setFetching(false));
  }, []);

  function createNewVSM() {
    setFetching(true);
    BaseAPIServices
      .post('/api/v1.0/project', {
        'name': 'Project name',
        'objects': [{
          'parent': 0,
          'name': 'Process name',
          'fkObjectType': vsmObjectTypes.process,
          'childObjects': [
            { 'fkObjectType': vsmObjectTypes.supplier, 'Name': 'supplier' },
            { 'fkObjectType': vsmObjectTypes.supplier, 'Name': 'input' },
            {
              'fkObjectType': vsmObjectTypes.input, 'Name': 'main activity',
              'childObjects': [{ 'fkObjectType': vsmObjectTypes.subActivity, 'Name': 'SubActivity' }],
            },
            { 'fkObjectType': vsmObjectTypes.waiting, 'Name': 'output' },
            { 'fkObjectType': vsmObjectTypes.output, 'Name': 'customer' },
          ],
        }],
      })
      .then(value => {
        // dispatch.setProject(value.data)
        return router.push(`/project/${value.data.vsmProjectID}`);
      })
      .catch(reason => {
        setError(reason);
      })
      .finally(() => setFetching(false));
  }

  if (error) return (
    <div className={commonStyles.container}>
      <Head>
        <title>Startpage</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={commonStyles.main}>
        <Typography variant={'h2'}>Couldn't fetch projects</Typography>
        <Typography variant={'h3'}>
          {error.toString()}
        </Typography>
      </main>
    </div>
  );

  return (
    <div className={commonStyles.container}>
      <Head>
        <title>VSM | Projects</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={commonStyles.main}>
        <div
          className='noselect'
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent:
              window.innerWidth > 550 ? 'space-between' : 'space-around',
            paddingBottom: 24,
          }}
        >
          <h1>My Value Stream Maps</h1>
          <Button variant={'outlined'} onClick={() => createNewVSM()}>
            Create new VSM
            <Icon name='add' title='add' size={16} />
          </Button>
        </div>
        <>
          {/*<LoadingIndicator isLoading={isLoading} />*/}
          {!!fetching
            ? <Typography variant={'h2'}>Fetching projects... </Typography>
            : (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: window.innerWidth > 550 ? 'unset' : 'center',
                }}
              >
                {projects?.length > 0 ? (
                  projects.map((vsm: VsmProject) => (
                    <VSMCard key={vsm.vsmProjectID} vsm={vsm} />
                  ))
                ) : (
                  <p className={'appear'}>Could not find any VSMs</p>
                )}
              </div>
            )}
        </>
      </main>
    </div>
  );
}

Project.layout = Layouts.Default;
Project.auth = true;
