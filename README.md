#  English Grammar Practice Bot
## Overview
The Grammar Quiz Bot is an interactive chatbot designed to help users improve their grammar skills. It provides quizzes on a variety of grammar topics, such as **Passive Voice, Present Perfect Tense, Future Perfect Tense, Jumbled Words, Fill the Prepositions, Nouns, Verbs**, and more. The bot adapts to user input by allowing the selection of different topics and difficulty levels, and after each question, it displays the correct answer along with a brief explanation.

## Features
1. **Welcome Message:**
   The bot starts with a friendly greeting: "Hi!". Users will then receive a welcome message and can select a grammar topic to begin.

2. **Select Grammar Topic:**
Users are presented with buttons to choose a grammar topic such as:
Passive Voice,
Present Perfect Tense,
Future Perfect Tense,
Jumbled Words,
Fill The Prepositions,
Nouns and Verbs. 
Upon selection, users can then choose the difficulty level: Easy, Medium, or Hard.

3. **Answer Questions:**
Based on the chosen topic and difficulty, users will receive a series of 10 grammar questions.
After each question is answered:
The bot provides feedback on whether the answer is correct.
The correct answer is displayed, along with a brief explanation to help users learn.

4. **View Score:**
After completing the set of 10 questions, the user’s score will be displayed out of 10.
The bot will also provide buttons to allow users to select a new grammar topic and difficulty level for a new quiz.

5. **Change Topic/Difficulty:**
Users can select a new grammar topic or change the difficulty level at the end of any quiz.
This feature allows for continuous learning and exploration of different grammar concepts.

## How to Use

* Start the bot.
* Choose a grammar topic.
* Select a difficulty level.
* Answer the questions and view explanations.
* Repeat or select a new topic after seeing your score.

# Prerequisites
Before you begin, ensure you have met the following requirements:

* Node.js and npm installed
* Nest.js CLI installed (npm install -g @nestjs/cli)
* MySQL database accessible

## Getting Started
### Installation
* Fork the repository
Click the "Fork" button in the upper right corner of the repository page. This will create a copy of the repository under your GitHub account.


* Clone this repository:
```
https://github.com/madgicaltechdom/chatbot-nestjs-boilerplate.git
```
* Navigate to the Project Directory:
```
cd chatbot-nestjs-boilerplate
```
* Install Project Dependencies:
```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# Add the following environment variables:

```bash
API_URL = API_URL
BOT_ID = BOT_ID
API_KEY = API_KEY
DATA_BASE=DATA_BASE
DB_HOST=DB_HOST
DB_USER=DB_USER
DB_PASSWORD=DB_PASSWORD
```
# API Endpoints
```
POST api/message: Endpoint for handling user requests. 
Get/api/status: Endpoint for checking the status of  api
```
# folder structure

```bash
src/
├── app.controller.ts
├── app.module.ts
├── main.ts
├── chat/
│   ├── chat.service.ts
│   └── chatbot.model.ts
├── common/
│   ├── exceptions/
│   │   ├── custom.exception.ts
│   │   └── http-exception.filter.ts
│   ├── middleware/
│   │   ├── log.helper.ts
│   │   └── log.middleware.ts
│   └── utils/
│       └── date.service.ts
├── config/
│   └── database.config.ts
├── i18n/
│   ├── en/
│   │   └── localised-strings.ts
│   └── hi/
│       └── localised-strings.ts
├── localization/
│   ├── localization.service.ts
│   └── localization.module.ts
│
├── message/
│   ├── message.service.ts
│   └── message.service.ts
└── model/
│   ├── user.entity.ts
│   ├──user.module.ts
│   └──query.ts
└── swiftchat/
    ├── swiftchat.module.ts
    └── swiftchat.service.ts

```

# Link
* [Documentation](https://app.clickup.com/43312857/v/dc/199tpt-7824/199tpt-19527)

