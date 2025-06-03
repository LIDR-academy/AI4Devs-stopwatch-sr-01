export class NotificationService {
  static notify(message) {
    if (Notification.permission === "granted") {
      new Notification(message);
    }
  }

  static requestPermission() {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }
}
