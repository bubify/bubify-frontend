import { Client, StompSubscription } from "@stomp/stompjs";
import { toast } from "react-toastify";
import { sleep } from "./sleep";

export interface Subscription {
  destination: string;
  callback: (message?: any) => Promise<void>;
}

const subscribe = async (
  stompClient: Client | null,
  subscription: Subscription[]
) => {
  const subscriptions: StompSubscription[] = [];

  if (stompClient === null) return subscriptions;
  let connected = stompClient?.connected;
  const MAX_RETRIES = 500; // => 5 min retry limit
  let tries = 0;

  while (!connected) {
    await sleep(600);
    connected = stompClient?.connected;
    tries++;
    if (tries >= MAX_RETRIES) {
      toast(
        "Socket connection error, aborting subscription attempt. Need to refresh browser.",
        {
          type: "error",
        }
      );
      return subscriptions;
    }
  }
  subscription.forEach((s) => {
    const result = stompClient.subscribe(s.destination, (message: any) => {
      s.callback(message.body);
    });
    if (result) subscriptions.push(result);
  });
  return subscriptions;
};

export default subscribe;
