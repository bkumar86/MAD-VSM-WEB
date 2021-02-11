import { useStoreDispatch, useStoreState } from '../../hooks/storeHooks';
import commonStyles from '../../styles/common.module.scss';
import Head from 'next/head';
import { Typography } from '@equinor/eds-core-react';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import BaseAPIServices from '../../services/BaseAPIServices';
import dynamic from 'next/dynamic';

const isServer = () => typeof window === 'undefined';
const DynamicComponentWithNoSSR = dynamic(
  () => import('../../components/VSMCanvas'),
  { ssr: false },
);

function Project() {
  const router = useRouter();
  const { id } = router.query;

  const project = useStoreState(state => state.project);
  const fetching = useStoreState(state => state.fetchingProject);
  const error = useStoreState(state => state.errorProject);
  const dispatch = useStoreDispatch();

  useEffect(() => {
    if (id) {
      dispatch.fetchProject({ id });
    }
  }, [id]);

  useEffect(() => {
    console.log({ project });
  }, [project]);

  function deleteProject(id) {
    BaseAPIServices
      .delete(`/api/v1.0/project/${id}`)
      .then(() => router.push(`/project`))
      .catch(reason => console.error(reason))
      .finally(() => console.log('Finished'));
  }


  if (fetching) {
    return (
      <div className={commonStyles.container}>
        <Head>
          <title>VSM | Project {id}</title>
          <link rel='icon' href='/favicon.ico' />
        </Head>

        <main className={commonStyles.main}>
          <Typography variant='h1'>Fetching project {id}</Typography>
        </main>
      </div>
    );
  }
  if (error) {
    return (
      <div className={commonStyles.container}>
        <Head>
          <title>VSM | Project {id}</title>
          <link rel='icon' href='/favicon.ico' />
        </Head>

        <main className={commonStyles.main}>
          <Typography variant='h1'>Error loading project {id}</Typography>
          <p>{error.toString()}</p>
        </main>
      </div>
    );
  }
  return (
    <div className={commonStyles.container}>
      <Head>
        <title>VSM | Project {id}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main>
        {/*<Button onClick={() => dispatch.fetchProject({ id })}>Fetch project</Button>*/}
        {/*<Button color={'danger'} variant={'outlined'} onClick={() => deleteProject(id)}>Delete project</Button>*/}
        <DynamicComponentWithNoSSR
          style={{
            // height: '100vh',
            // overflowY: 'scroll',
            // position: 'absolute',
            // left: 0,
            // top: 0,
          }}
          data={project}
          refreshProject={() => dispatch.fetchProject({ id })} />
      </main>
    </div>
  );
  // return (
  //   <div className={commonStyles.container}>
  //     <Head>
  //       <title>VSM | Project {id}</title>
  //       <link rel='icon' href='/favicon.ico' />
  //     </Head>
  //
  //     <main className={commonStyles.main}>
  //       <Typography variant='h1'>#{id} {project?.name ?? 'No name'}</Typography>
  //       <hr />
  //       <Button onClick={() => dispatch.fetchProject({ id })}>Fetch project</Button>
  //       <hr />
  //       <Button color={'danger'} variant={'outlined'} onClick={() => deleteProject(id)}>Delete project</Button>
  //       <hr />
  //       {/*<PixiCanvas data={project} refreshProject={() => dispatch.fetchProject({ id })}/>*/}
  //       {/*<VSMCanvas data={project} refreshProject={() => dispatch.fetchProject({ id })} />*/}
  //       <hr />
  //       <Button color={'danger'} variant={'outlined'} onClick={() => dispatch.updateVSMObject(
  //         {
  //           'vsmObjectID': 368,
  //           'name': `NEW PROCESS`,
  //           'time': 5000,
  //           'role': 'Money maker',
  //         },
  //       )}
  //       >Patch object</Button>
  //       <hr />
  //       <ReactJson src={project} />
  //     </main>
  //   </div>
  // );
}

export default Project;
Project.auth = true;
