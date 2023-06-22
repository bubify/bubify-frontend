import { Client, StompSubscription } from "@stomp/stompjs";
import subscribe, { Subscription } from "../../utils/subscribe";

interface SubscriptionMapping {
  config: Subscription[],
  subscriptions: StompSubscription[]
}
export class SubscriptionContext {
  private static instance: SubscriptionContext;
  private subscriptionMapping: SubscriptionMapping | undefined

  public async register(stompClient: Client | null, config: Subscription[]) {
    if (!stompClient) return;
    const subscriptions = await subscribe(stompClient, config);
    if (this.subscriptionMapping) this.unregister();
    this.subscriptionMapping = { config, subscriptions }
  }

  public async reconnect(stompClient: Client | null) {
    if (!stompClient || !this.subscriptionMapping) return;
    const subscriptions = await subscribe(stompClient, this.subscriptionMapping.config);
    this.subscriptionMapping = { config: this.subscriptionMapping.config, subscriptions }
  }

  public unregister() {
    this.subscriptionMapping?.subscriptions.forEach(sub => sub.unsubscribe())
    this.subscriptionMapping = undefined;
  }

  static getInstance(): SubscriptionContext {
    if (!SubscriptionContext.instance) {
      SubscriptionContext.instance = new SubscriptionContext();
    }

    return SubscriptionContext.instance;
  }

}