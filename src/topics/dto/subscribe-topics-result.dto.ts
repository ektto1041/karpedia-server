export class SubscribeTopicsResultDto {
  constructor(subscribed: boolean) {
    this.subscribed = subscribed;
  }

  subscribed: boolean;
}