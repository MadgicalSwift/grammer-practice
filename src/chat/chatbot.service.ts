import { Injectable } from '@nestjs/common';
import IntentClassifier from '../intent/intent.classifier';
import { MessageService } from 'src/message/message.service';
import { UserService } from 'src/model/user.service';
import { User } from 'src/model/user.entity';
import { MixpanelService } from 'src/mixpanel/mixpanel.service';
import { localisedStrings } from 'src/i18n/en/localised-strings';

@Injectable()
export class ChatbotService {
  private readonly intentClassifier: IntentClassifier;
  private readonly message: MessageService;
  private readonly userService: UserService;
  private readonly mixpanel: MixpanelService;

  constructor(
    intentClassifier: IntentClassifier,
    message: MessageService,
    userService: UserService,
    mixpanel: MixpanelService,
  ) {
    this.intentClassifier = intentClassifier;
    this.message = message;
    this.userService = userService;
    this.mixpanel = mixpanel;
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
    console.log('Difficulty :',userData.topic)
    console.log('Topic :',userData.difficulty)

    let allTopic = await this.message.getAllTopic()
    // const { intent, entities } = this.intentClassifier.getIntent(text.body);
    // if (userData.language === 'english' || userData.language === 'hindi') {
    //   await this.userService.saveUser(userData);
    // }

    if (button_response) {
      if (userData.topic && userData.difficulty) {
        // User has selected both topic and difficulty, handle the answer
        // await this.userService.resetUserProgress(from);
        console.log(userData.topic, userData.difficulty);
        await this.message.handleAnswer(from, button_response.body);
        await this.message.sendNextQues(from);
        
      } else if (localisedStrings.dififcultyLevel.includes(button_response.body)) {
        // User has selected topic but not difficulty
        console.log('Difficulty selected:', button_response.body);
        userData.difficulty = button_response.body;
        await this.userService.saveLevelName(from,botID, button_response.body);
        await this.message.startQuiz(from, userData.topic, userData.difficulty);
        this.mixpanel.track('Button_Click', {
          distinct_id: from,
          language: userData.language,                                                                
          topic:button_response?.body,
        });
      } else if (allTopic.includes(button_response.body)) {
        // User has not selected topic
        console.log('Topic selected:', button_response.body);
        userData.topic = button_response.body;
        
        await this.message.sendDifficultyButtons(from);
        await this.userService.saveTopicName(from,botID, button_response.body);
        this.mixpanel.track('Button_Click', {
          distinct_id: from,
          language: userData.language,
          difficulty_level:button_response?.body,
        });
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

     // Handle text message
     if (localisedStrings.validText.includes(text.body)) {

      await this.message.sendWelcomeMessage(from, userData.language);
      this.mixpanel.track('Bot_start', {
        distinct_id: from,
        language: userData.language,
        question:body?.text?.body
      });
      
    }
    // if (text && text.body) {
    //   const { intent, entities } = this.intentClassifier.getIntent(text.body);

    //   if (intent === 'select_language') {
    //     const selectedLanguage = entities[0];
    //     userData.language = selectedLanguage;
    //     await this.userService.saveUser(userData);
    //     await this.message.sendLanguageChangedMessage(from, userData.language);
    //   } else {
    //     await this.message.sendWelcomeMessage(from, userData.language);
    //     this.mixpanel.track('Bot_start', {
    //       distinct_id: from,
    //       language: userData.language,
    //       question:body?.text?.body
    //     });
    //   }
    // } else if (body.text && body.text.body === 'greeting') {
    //   console.log('hi');
    //   await this.message.sendWelcomeMessage(from, userData.language);
    //   this.mixpanel.track('Bot_start', {
    //     distinct_id: from,
    //     language: userData.language,
    //     question:body?.text?.body
    //   });
    // } else {
    //   await this.message.sendWelcomeMessage(from, userData.language);
    //   this.mixpanel.track('Bot_start', {
    //     distinct_id: from,
    //     language: userData.language,
    //     question:body?.text?.body
    //   });
    // }

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
