# Pomotodoro

## Introduction


Pomotodoro is a full stack todo app.

- JavaScript Es6 is used as the main language.

- React is used as the Framework Library. All the components use React Hooks, which provide us function style coding experience.

- TailwindCss is used to format all elements appeared on the webapp. 

- Mongodb is chosen as the database. 

- Also, express works as the API server.

## Usage

- Make sure you have installed node.js with the version over 16.

- Fetch our repository using the tool Git.

### Installation

- Enter the path of the project using your terimal tool.

```
    cd ./client
```
```
    npm install
```
If you are famailiar with yarn, you can use.
```
    yarn install
```
- Go back to the Project path.
```
    cd ./server
```
```
    npm install
```
### Start
- Start client
``` 
    npm start
```
- Start server
```
    node server.js
```
### Build Client
```
    npm build
```
Install serve
```
    npm install -g serve
```
Serve the optimistic build product using serve.
```
    serve -s build
```
---


## Features

### Account and Privacy
You can signup and login your account in our app. Space in your username is supported.

 You can delete your account and all data after tapping the delete button and entering the correct username and password.

 Right now, I only crypt the transfered data using ase-256-cbc algorithm. I will crypt database data in the following updata.

 If you worry about the privacy problem. You can use offline mode only. 

### Online and Local mode
The App can be used both online and offline.

If not logged in, you can only use local mode. After logging in, both mode will be available.

In order to protect your privacy, our online and offline data is separated.
But each side can still communicate using override or merge button provided in the setting pannel.

If you suddenly goes offline, our app will turn you into offline mode and merge your current online data to your local data, which makes sure everthing you add before is ok.

### PomoMode and ClockMode
PomoMode allows you to set pomoTimes to your tasks. You can use pomoTimes to meansure the time your task needs. 

The maximum of pomoTimes is 5. Because we keep the law of pomodoro working method. A task which will use more than 2.5h to finish is too big. You should devide the task as small as you can to guarantee efficency. 

ClockMode provide you a pomodoro timer, which works with pomoTimes.

ClockMode can't be used if pomoMode is off.
### Todo and Schedule
The App has two lists: todo and schddule. 

Todo is designed to contain the tasks you want to do right now, and the Schedule is
designed to hold all tasks. 

You can add tasks from schdule to todo using Add Today button or turn load switch on in the detail page.

Certainly, everything you add in the todo list will be add into the schdule list.

As designed, schdule list focus on management and todo list focus on doning.
So you can't use pomoClock in the schedule list. 

If you want to work with pomodoro clock, add task to the todo list.

### Subtasks
As I proposed before, you should try to obey the pomodoro method, when making your tasks list. So the amount of  subtask each task have is of no doubt limited.

We advise you to devide your task into subtasks according to the pomoTimes you set. It makes sense, eh ?


---
Composed by Ho Yel-i 