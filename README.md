# SveJ

**SveJ** or previously known as **Sib0p** was a social media platform I've worked on years ago. I've created the designs, developed the app and the backend. It had more than 50k downloads world-wide. It was a fun project to work on and I've learned a lot from it. I've decided to re-create it based on the old repo and open source it so that it can be useful for someone else.

The app is not finished yet. Screens and designs nearly finished but the components should be re-organized (old repo mistakes). Also the backend is not developed and implemented to the app yet. There are literally no tests written so far.

I'll be working on it in my free time. If you want to contribute, feel free to open a PR. I'll be happy to review it.

## Tech Stack

- [TypeScript](https://www.typescriptlang.org/)
- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [React Native Gesture Handler](https://software-mansion.github.io/react-native-gesture-handler/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)

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

## TODO

- [ ] Re-organize components
- [ ] Develop backend
- [ ] Implement backend to the app
- [ ] Create the messaging system
