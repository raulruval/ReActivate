### Installation

```bash
npm install && npm run install-pose-runtimes
```

That npm script will also install the @mediapipe/pose library into the _public/vendor/@mediapipe/_ directory and will make a link named _pose_ to the installed version. The version installed can be changed in the npm script contained in the _package.json_ file; the selected version should match the one used in the _dependencies_ section of the file for the _@mediapipe/pose_ entry. 

Also, check the _scripts/install-pose-runtimes.sh_ script for advanced options.

### Start development server:

```bash
npm start
```

## Project Structure

```bash
    .
    ├── public/  # The final directory where all assets are added and also where the final bundle.js will be store
    │   ├── assets/  # Add here all the assets related to your application
    │   ├── vendor/  # All the external scripts that shouldn't be compiled; mostly to hold the @mediapipe/pose WASM runtimes
    │   ├── index.html  # The base HTML file
    ├── src/  # All the TypeScript files that comprise your application
    │   ├── pose-tracker-engine/  # Directory holding all the @mediapipe/pose wrappers and utilities made for the application    
    │   ├── scenes/  # All the scenes of the application
    │   ├── types/  # Global interfaces, enums, types, etc
    │   ├── main.ts  # The main TS file that will be executed when the application runs
    ├── package.json  # The file with the build script and the dependencies
```

TypeScript files are intended to be in the `src/` folder. `main.ts` is the entry point to build the `bundle.js` file
referenced by `index.html`; that file will be copied to the `public/` directory on every build along with its source
maps (if development environment).

## Pose Tracker

The _Pose Tracker_ is the set of custom wrappers and utilities that ease using the @mediapipe/pose JavaScript library.

It's made of the next files:

- `pose-tracker.ts`: allows to instantiate an object of the pose tracker that will listen for tracking results (i.e. new
  frame/joints detected) and invoke a custom user-callback when they are available.
- `camera.ts`: a simple wrapper for the _navigator.mediaDevices_ browser object that will intercept new webcam frames
  and invoke to a custom user-callback function.
- `abstract-pose-tracker-scene.ts`: an already configured and ready-to-use Phaser scene to be extended by other scenes
  where you want to have pose tracker capabilities.

In brief, you should be extending the **AbstractPoseTrackerScene** class in a new one, and populating it overriding the
inherited method like this:

```typescript
import AbstractPoseTrackerScene from '~/pose-tracker-engine/abstract-pose-tracker-scene';

export default class SampleScene extends AbstractPoseTrackerScene {
    constructor() {
        super('sample-scene');
    }

    preload(): void {
        super.preload();
    }

    create(): void {
        super.create();
    }

    update(time: number, delta: number): void {
        super.update(time, delta, {
            renderElementsSettings: {
                shouldDrawFrame: true, // Set it to true/false whether you want to render the camera frame in the canvas texture
                shouldDrawPoseLandmarks: true, // Set it to true/false whether you want to render the pose landmarks (joints) along with their connections in the canvas texture
            },
            beforePaint: (poseTrackerResults, canvasTexture) => {
                // This function will be called before refreshing the canvas texture.
                // Anything you add here to the canvas texture will be rendered.
            },
            afterPaint: (poseTrackerResults) => {
                // This function will be called after refreshing the canvas texture.
            },
        });

        // Here you can do any other update related to the game.
        // PoseTrackerResults are only available in the previous callbacks, though.
    }
}
```

## Technological stack

The technological stack includes:

- **phaser** as development framework.
- **@mediapipe/pose** for all the skeleton tracking stuff.
- **typescript** for not going mad without types.
- **esbuild** for bundling/transpile TypeScript files to JavaScript.
- **browsersync** for reloading the dev server on every file changes.
- **prettier** to format source files homogeneously.
- **eslint** to check/fix errors in the code.
- **husky** for running the previous processes on every commit.
