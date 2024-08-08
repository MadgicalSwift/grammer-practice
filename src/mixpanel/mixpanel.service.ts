import * as Mixpanel from 'mixpanel';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MixpanelService {
  private mixpanel: any;

  constructor() {
    this.mixpanel = Mixpanel.init('2d9a470b4e2e370f38e66a6022db8a01', {
      protocol: 'http',
    });
  }

  public track(eventName: string, action: any = {}): void {
    this.mixpanel.track(eventName, action);
  }
}