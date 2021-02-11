import React, { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';
import { Application } from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import { isMobile } from 'react-device-detect';
// import { vsmObjectTypes } from "../utils/VsmObjectTypes";
import { formatCanvasText } from './canvas/FormatCanvasText';
import { vsmObjectFactory } from './canvas/VsmObjectFactory';
import { SingleSelect, TextField } from '@equinor/eds-core-react';
import { vsmObjectTypes } from '../types/vsmObjectTypes';
import ReactJson from 'react-json-view';
// import { patchData } from "../utils/PatchData";
import styles from './VSMCanvas.module.scss';
import { useStoreDispatch } from '../hooks/storeHooks';
import { debounce } from '../utils/debounce';

const defaultObject = {
  name: '',
  vsmObjectType: { name: '', pkObjectType: 0 },
  vsmObjectID: 0,
  time: 0,
  role: '',
};

export default function VSMCanvas(props: {
  style?: React.CSSProperties | undefined;
  data: any;
  refreshProject: () => void;
}): JSX.Element {
  const ref = useRef(document.createElement('div'));
  const [selectedObject, setSelectedObject] = useState(defaultObject);
  const dispatch = useStoreDispatch();


  useEffect(() => {

    // PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
    // PIXI.settings.ROUND_PIXELS = true;
    const app = new Application({
      resizeTo: window,
      backgroundColor: 0xf7f7f7,
      antialias: true,
    });

    const viewport = new Viewport({
      interaction: app.renderer.plugins.interaction, // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
    });

    // add the viewport to the stage
    app.stage.addChild(viewport);

    // activate plugins
    if (isMobile) {
      viewport
        .drag()
        .pinch() // This doesn't work that well on desktop.
        .wheel()
        .decelerate({ friction: 0.15 });
    } else viewport.drag().wheel().decelerate({ friction: 0.15 });
    //Todo: Improve this hack
    viewport.on('clicked', () => setSelectedObject(defaultObject));

    //// View was a bit too high. So removing 4px from it. But this doesn't work after resizing the view...So Todo: improve
    app.view.height = app.view.height - 4; // <-  Hack to remove scrollbar.

    // Add app to DOM
    ref.current.appendChild(app.view);

    // Start the PixiJS app
    app.start();

    // AddRotatingBunnies(app);
    // GenericPostit({
    //   app: app,
    // });

    const projectName = props.data.name;
    //Todo: Add title to stage
    const defaultStyle = {
      fontFamily: 'Equinor',
      fontWeight: 500,
      fontSize: 24,
      lineHeight: 16,
      letterSpacing: 0.2,
      wordWrapWidth: 400,
      wordWrap: true,
      breakWords: true,
      trim: true,
    };

    const projectText = new PIXI.Text(
      formatCanvasText(projectName, 200),
      defaultStyle,
    );
    projectText.x = viewport.x;
    projectText.y = viewport.y;
    projectText.alpha = 0.4;
    projectText.resolution = 4;

    const rootObject = props.data.objects ? props.data.objects[0] : null;
    const levelOne = new PIXI.Container();
    if (rootObject) {
      levelOne.addChild(
        vsmObjectFactory(rootObject, () =>
          setTimeout(() => setSelectedObject(rootObject), 10),
        ),
      );
    }

    const levelTwo = new PIXI.Container();
    let nextX = 0;
    rootObject?.childObjects
      .map(
        (o: {
          name: string;
          vsmObjectType: { name: string; pkObjectType: number };
          vsmObjectID: number;
          time: number;
          role: string;
        }) => {
          const onPress = () => setTimeout(() => setSelectedObject(o), 10);
          return vsmObjectFactory(o, onPress);
        },
      )
      .forEach((c: PIXI.Graphics) => {
        const padding = 10;
        if (nextX) c.x = nextX;
        nextX = c.x + c.width + padding * 2;
        return levelTwo.addChild(c);
      });

    levelTwo.y = 300;
    levelTwo.x = 150;
    levelOne.x = levelTwo.width / 2 + levelOne.width / 2 + 23.5; //Todo: figure out better logic for centering
    levelOne.y = levelTwo.y - 200;
    viewport.addChild(levelOne, levelTwo);

    return () => {
      app.stop();
      // On unload completely destroy the application and all of it's children
      app.destroy(true, { children: true });
    };
  }, [props.data]);

  // let a: NodeJS.Timeout;

  function updateName(newName: string) {
    // setSelectedObject({ ...selectedObject, name: newName });
    dispatch.updateVSMObject({ ...selectedObject, name: newName });
    // if (a) clearTimeout(a);
    // a = setTimeout(() => {
    //
    //   console.log(
    //     '/api/v1.0/vsmObject',
    //     {
    //       vsmObjectID: selectedObject.vsmObjectID,
    //       name: newName,
    //     },
    //     // account,
    //     // instance,
    //     // (response: any) => {
    //     //   props.refreshProject();
    //     //   console.log({ response });
    //     // }
    //
    //   );
    // }, 1000);
  }

  return (
    <>
      <div
        className={
          selectedObject === defaultObject
            ? styles.hideSideBarToRight
            : styles.vsmSideMenu
        }
      >
        <h1 className={styles.sideBarHeader}>{selectedObject.vsmObjectType.name}</h1>
        <div className={styles.sideBarSectionHeader}>
          <p>General Information</p>
        </div>
        <div style={{ paddingTop: 8 }}>
          <TextField
            label='Add description'
            multiline
            rows={4}
            variant='default'
            value={selectedObject.name}
            onChange={(event: { target: { value: any } }) => {
              const newName = event.target.value;
              setSelectedObject({ ...selectedObject, name: newName });
              debounce(() => {
                  dispatch.updateVSMObject({ ...selectedObject, name: newName });
                }, 1000, 'Canvas-UpdateName',
              )();
            }}
            id='vsmObjectDescription'
          />
        </div>
        <div style={{ display: 'flex', paddingTop: 10 }}>
          {(selectedObject.vsmObjectType.pkObjectType ===
            vsmObjectTypes.mainActivity ||
            selectedObject.vsmObjectType.pkObjectType ===
            vsmObjectTypes.subActivity) && (
            <>
              <TextField
                disabled
                label='Role'
                variant='default'
                value={selectedObject.role?.toString() ?? 'Role'}
                id={'vsmObjectRole'}
              />
              <div style={{ padding: 8 }} />
              <TextField
                disabled
                label='Time'
                value={selectedObject.time?.toString() ?? '1 min'}
                variant='default'
                id={'vsmObjectTime'}
              />
            </>
          )}
        </div>
        <div className={styles.sideBarSectionHeader}>
          <p>Add problem, idea or question</p>
        </div>
        <SingleSelect
          disabled
          items={[
            'Problem',
            'Idea',
            'Question',
            'Existing Problem',
            'Existing Idea',
            'Existing Question',
          ]}
          handleSelectedItemChange={(changes) => console.log(changes)}
          label='Select type'
        />

        {/*Todo: Add accordion */}
        <div className={styles.sideBarSectionHeader}>
          <p>Debug section</p>
        </div>
        <ReactJson src={selectedObject} theme={'apathy:inverted'} />
      </div>
      <div style={props.style} ref={ref} />
    </>
  );
}
