WorkFlow : Cyberbullying Detection System Using Firebase Authentication
Firebase User Authentication
User Login: User Log into login form through a web app.
Firebase Authentication:
Firebase now check whether email/password/Google/Facebook for credentials of that particular user.
When their session is authenticated, Firebase provides a unique token for the session —an auth token— guaranteeing communication between client with quthenticated state and server.
Login Session: Each user has to be logged→session → visit & Post comments on the platform.
Input Comments:
Using the platform, authorized (authenticated) users post comments.
Any comments are then processed immediately.
Comment Analysis:
Google Perspective API:
The posted comment is being sent to Google's Perspective API.
This API was used to determine the toxicity level of a comment (eg: insults, threats, profanity).
Toxicity Score:
If the saying belongs to bullying or being inappropriate, it will be filtered and archived under that heading.
Warnings System:
The system also tracks the violations that show up for a given authenticated user account, one violation per toxic comment detected.
Progressive Warning System:
1st Offence – A Warning is issued to the User.
2nd Violation: Additional warning to indicate the gravity of a violation.
3rd+ Violation: Final Warning
Upon Third Violation – User Suspension
The system may:
7- Account suspension for a period of 7 days
Logs the suspension to user profile in Firebase database
Suspend the user directly from posting or interacting with comment section
Notify User ( Email / In-App Messages): The user is notified of their suspension.
Database Integration:
Firebase Database:
User profiles, violations history and suspension details.
Monitors history of all comments flagged for review
Google Perspective Feedback:
Admins can also check flagged comments for tuning toxicity thresholds or reviewing appeals.
Feedback and Automation:
1) The actions taken are monitored, 
2) after a suspension the system observes how our user is behaving.
Repeat offenders may be subject to harsher penalties like permanent account bans.





![Group 1](https://github.com/user-attachments/assets/ef580157-a048-43bd-b41a-9e7fc4665819)
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)



