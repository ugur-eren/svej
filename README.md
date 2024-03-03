# SveJ

**SveJ** or previously known as **Sib0p** was a social media platform I've worked on years ago. I've created the designs, developed the app and the backend. It had more than 50k downloads world-wide. It was a fun project to work on and I've learned a lot from it. I've decided to re-create it based on the old repo and open source it.

The app is almost completed. Most pages are done and the backend is working. However there are many small things to fix and improve.

I'll be working on it in my free time. If you want to contribute, feel free to open a PR. I'll be happy to review it.

## Screenshots

You can find the screenshots of the app in the `screenshots` folder.

[screenshots/README.md](https://github.com/ugur-eren/svej/blob/main/screenshots/README.md)

## Tech Stack

### App

- [TypeScript](https://www.typescriptlang.org/)
- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [React Native Gesture Handler](https://software-mansion.github.io/react-native-gesture-handler/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [Redux](https://redux.js.org/) & [Redux Toolkit](https://redux-toolkit.js.org/) & [Redux Persist](https://github.com/rt2zz/redux-persist)

### Backend

- [TypeScript](https://www.typescriptlang.org/)
- [Express](https://expressjs.com/)
- [Socket.io](https://socket.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Prisma ORM](https://www.prisma.io/)
- [Sharp](https://sharp.pixelplumbing.com/) for image processing
- [FFmpeg](https://ffmpeg.org/) & [FFprobe](https://ffmpeg.org/ffprobe.html) for video processing

## Prerequisites

- [Node.js](https://nodejs.org/en/)
- [PostgreSQL](https://www.postgresql.org/) for database
- [FFmpeg](https://ffmpeg.org/) and [FFprobe](https://ffmpeg.org/ffprobe.html) for backend video processing

> Note: I chose not to include pre-built binaries so you should have `ffmpeg` and `ffprobe` installed on your machine to run the backend.
> Probably will include the pre-built binaries or completely move the video processing to Rust in the future.

## How to run

1. Clone the repo
2. Install dependencies `yarn install`
3. Create a `.env` file and add fill it using `.env.sample` file
4. Run the app `yarn start`
5. Open the app on your phone with Expo app or run it on a simulator

## How to contribute

1. Fork the repo
2. Create a branch
3. Make your changes
4. Make sure the app is running without any errors. This must be done manually for now since there are no tests written yet.
5. Run `yarn run check` to make sure there are no formatting, linting or TypeScript errors
6. Commit your changes
7. Open a PR and clearly describe your changes
