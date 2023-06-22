import Notify from "notifyjs";

export const browserNotification = (title: string, body: string) => {
  if (!Notify.needsPermission) {
    const n = new Notify(title, {
      body,
    });
    n.show();
  }
};
