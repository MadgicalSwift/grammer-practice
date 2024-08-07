import { Injectable } from '@nestjs/common';
import IntentClassifier from '../intent/intent.classifier';
import { MessageService } from 'src/message/message.service';
import { UserService } from 'src/model/user.service';
import { User } from 'src/model/user.entity';
@Injectable()
export class ChatbotService {
  private readonly intentClassifier: IntentClassifier;
  private readonly message: MessageService;
  private readonly userService: UserService;

  constructor(
    intentClassifier: IntentClassifier,
    message: MessageService,
    userService: UserService,
  ) {
    this.intentClassifier = intentClassifier;
    this.message = message;
    this.userService = userService;
  }

  public async processMessage(body: any): Promise<any> {
    const { from, button_response, text } = body;
    console.log('button response:', button_response);
    let botID = process.env.BOT_ID;

    let userData = await this.userService.findUserByMobileNumber(from, botID);
    if (!userData) {
      console.log('User not found');
      userData = await this.userService.createUser(
        from,
        'english',
        process.env.BOT_ID,
      );
      console.log('NEW user created');
    }
    // const { intent, entities } = this.intentClassifier.getIntent(text.body);
    if (userData.language === 'english' || userData.language === 'hindi') {
      await this.userService.saveUser(userData);
    }

    if (button_response) {
      if (button_response.body === 'Next') {
        await this.message.sendNextQues(from);
      } else if (button_response.body === 'Back to Main Menu') {
        await this.userService.resetUserProgress(from);
        await this.message.sendTopicsList(from);
      } else if (userData.topic && userData.difficulty) {
        // User has selected both topic and difficulty, handle the answer
        // await this.userService.resetUserProgress(from);
        console.log(userData.topic, userData.difficulty);
        await this.message.handleAnswer(from, button_response.body);
        // await this.message.sendNextAndMainMenuButtons(from);
        await this.message.sendNextQues(from);
      } else if (userData.topic) {
        // User has selected topic but not difficulty
        console.log('Difficulty selected:', button_response.body);
        userData.difficulty = button_response.body;
        await this.userService.saveUser(userData);
        await this.message.startQuiz(from, userData.topic, userData.difficulty);
      } else if (!userData.topic && !userData.difficulty) {
        // User has not selected topic
        console.log('Topic selected:', button_response.body);
        userData.topic = button_response.body;
        await this.userService.saveUser(userData);
        await this.message.sendDifficultyButtons(from);
      } else {
        await this.userService.resetUserProgress(from);
        await this.message.sendWelcomeMessage(from, userData.language);
      }
      return 'ok';
    }
    // if (button_response) {
    //   // console.log('hello');
    //   if (button_response.body === 'Passive Voice') {
    //     console.log(userData.topic, userData.difficulty);
    //     await this.message.sendDifficultyButtons(from);
    //   } else if (['easy', 'medium', 'hard'].includes(button_response.body)) {
    //     console.log(userData.topic, userData.difficulty);
    //     await this.message.startQuiz(
    //       from,
    //       'Passive Voice',
    //       button_response.body,
    //     );
    //   }
    //   return 'ok';
    // }

    // if (button_response) {
    //   const { reply } = button_response;

    //   if (userData.topic && userData.difficulty) {
    //     console.log(userData.topic, userData.difficulty);
    //     await this.message.handleAnswer(from, reply);
    //   } else if (userData.topic) {
    //     console.log('hello');
    //     await this.message.startQuiz(from, reply, userData.difficulty);
    //   } else if (!userData.difficulty) {
    //     console.log('sfv');
    //     await this.message.startQuiz(from, userData.topic, reply);
    //   }
    // }

    // else {
    //   const { intent, entities } = this.intentClassifier.getIntent(text?.body);

    //   if (intent === 'start_quiz') {
    //     await this.message.sendTopicsList(from);
    //   } else if (intent === 'change_language') {
    //     const selectedLanguage = entities[0];
    //     userData.language = selectedLanguage;
    //     await this.userService.saveUser(userData);
    //     await this.message.sendLanguageChangedMessage(from, userData.language);
    //   } else {
    //     await this.message.sendWelcomeMessage(from, userData.language);
    //   }
    // }
    if (text && text.body) {
      const { intent, entities } = this.intentClassifier.getIntent(text.body);

      if (intent === 'select_language') {
        const selectedLanguage = entities[0];
        userData.language = selectedLanguage;
        await this.userService.saveUser(userData);
        await this.message.sendLanguageChangedMessage(from, userData.language);
      } else {
        await this.message.sendWelcomeMessage(from, userData.language);
      }
    } else if (body.text && body.text.body === 'greeting') {
      console.log('hi');
      await this.message.sendWelcomeMessage(from, userData.language);
    } else {
      await this.message.sendWelcomeMessage(from, userData.language);
    }

    // if (body.text.body === 'greeting') {
    //   this.message.sendWelcomeMessage(from, userData.language);
    // } else if (button_response && body.text) {
    //   this.message.sendLanguageChangedMessage(from, button_response.body);
    // } else if (intent === 'select_language') {
    //   const selectedLanguage = entities[0];
    //   const userData = await this.userService.findUserByMobileNumber(from);
    //   userData.language = selectedLanguage;
    //   await this.userService.saveUser(userData);
    //   this.message.sendLanguageChangedMessage(from, userData.language);
    // } else {
    //   this.message.sendWelcomeMessage(from, userData.language);
    // }
    return 'ok';
  }
}
export default ChatbotService;
