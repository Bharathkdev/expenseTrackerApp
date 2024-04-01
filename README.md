## 🚀 Money Manager App 🚀

📱 I've built a React Native app with an intuitive UI to simplify financial management! 💸✨

<img width="325" alt="moneymanager" src="https://github.com/Bharathkdev/expenseTrackerApp/assets/46343966/95a14f4f-e25b-44e9-a69e-ee3b3e4fbf47">

Witness how seamlessly you can handle income, transfers and expenses with sleek Victory Native charts and a robust Firebase realtime database, ensuring simplicity and efficiency. 📊🗄️

And that's just the beginning! Explore three key sections:

```
1. Transactions: Add, edit, update, and delete daily transactions, easily viewed in various formats—Daily, Calendar, Weekly, and Monthly.
2. Statistics: Dive into beautiful charts for crystal-clear data insights, allowing you to analyze earnings and expenses across different categories.
3. Accounts: Gain a comprehensive overview of yearly income and expenses through insightful charts.
```

Plus, the app features a user-friendly month-year filter for effortlessly managing your finances! 💸🗓️

## Prerequisites

Before you begin, ensure you have met the following requirements:

**Environment setup**: https://reactnative.dev/docs/environment-setup

## Clone the Repository

First, clone this repository to your local machine using Git:

```
git clone https://github.com/Bharathkdev/expenseTrackerApp/
```

## Navigate to the App Folder

Change your working directory to the app folder:

```
cd expenseTrackerApp/
```

## Install Dependencies

You can use npm or yarn to install the project dependencies.

### Using Yarn:

```
yarn install
``` 

### Using npm:

```
npm install
```

## iOS Specific Steps

### Install iOS Dependencies

Before running the app on an iOS simulator or device, you'll need to install iOS dependencies using CocoaPods. Run the following commands:

```
cd ios/
pod install
```

This will install the required dependencies for the iOS portion of your app.

## Running the App

You can run the application on either an Android or iOS emulator, or on a physical device if it's connected to your development machine.

### Android

To run the app on an Android emulator or device, use one of the following commands:

### Using Yarn:

```
yarn android
```

### Using React Native CLI:

```
npx react-native run-android
```

### iOS

To run the app on an iOS simulator or device, use one of the following commands:

### Using Yarn:

```
yarn ios
```

### Using React Native CLI:

```
npx react-native run-ios
```
## Troubleshooting

If you face any error while installing pods using pod install make sure your pod version is up-to-date. Run the following command:

```
cd ios/
pod install --repo-update
```

