import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { User } from './user.entity';
import { dynamoDBClient } from 'src/config/database-config.service';
import { PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
const { USER_TABLE } = process.env;

@Injectable()
export class UserService {
  async createUser(
    mobileNumber: string,
    language: string,
    botID: string,
  ): Promise<User | any> {
    try {
      let user = await this.findUserByMobileNumber(mobileNumber, botID);

      if (user) {
        const updateUser = {
          TableName: USER_TABLE,
          Item: user,
        };
        await dynamoDBClient().put(updateUser).promise();
        return user;
      } else {
        const newUser = {
          TableName: USER_TABLE,
          Item: {
            id: uuidv4(),
            mobileNumber: mobileNumber,
            language: language,
            botID: botID,
          },
        };
        await dynamoDBClient().put(newUser).promise();
        return newUser;
      }
    } catch (error) {
      console.error('Error in createUser:', error);
    }
  }

  async findUserByMobileNumber(
    mobileNumber: string,
    botID?: string,
  ): Promise<any> {
    const params: any = {
      TableName: USER_TABLE,
      KeyConditionExpression: 'mobileNumber = :mobileNumber',
      ExpressionAttributeValues: {
        ':mobileNumber': mobileNumber,
      },
    };
    if (botID) {
      params.FilterExpression = 'botID = :botID';
      params.ExpressionAttributeValues[':botID'] = botID;
    }
    try {
      const result = await dynamoDBClient().query(params).promise();
      return result.Items && result.Items.length > 0 ? result.Items[0] : null;
    } catch (error) {
      console.error('Error querying user from DynamoDB:', error);
      return null;
    }
  }

  async saveUser(user: User): Promise<User | any> {
    const updateUser = {
      TableName: USER_TABLE,
      Item: user,
    };
    return await dynamoDBClient().put(updateUser).promise();
  }

  // User Progress Functionalities

  async getUserProgress(mobileNumber: string): Promise<any> {
    const params: any = {
      TableName: USER_TABLE,
      KeyConditionExpression: 'mobileNumber = :mobileNumber',
      ExpressionAttributeValues: {
        ':mobileNumber': mobileNumber,
      },
    };

    try {
      const result = await dynamoDBClient().query(params).promise();
      return result.Items && result.Items.length > 0 ? result.Items[0] : null;
    } catch (error) {
      console.error('Error querying user from DynamoDB:', error);
      return null;
    }
  }

  async saveUSerProgress(user: User): Promise<User | any> {
    const updateUser = {
      TableName: USER_TABLE,
      Item: user,
    };
    return await dynamoDBClient().put(updateUser).promise();
  }

  // async resetUserProgress(mobileNumber: string): Promise<void> {
  //   let botId = process.env.botId;
  //   const user = await this.findUserByMobileNumber(mobileNumber, botId);
  //   if (user) {
  //     user.topic = null;
  //     user.difficulty = null;
  //     user.currentquesindex = 0;
  //     user.score = 0;
  //   }
  // }
  async resetUserProgress(mobileNumber: string): Promise<void> {
    const user = await this.getUserProgress(mobileNumber);
    if (user) {
      user.topic = null;
      user.difficulty = null;
      user.currentquesindex = 0;
      user.score = 0;
      const updateUser = {
        TableName: USER_TABLE,
        Item: user,
      };
      await dynamoDBClient().put(updateUser).promise();
    }
  }
}
