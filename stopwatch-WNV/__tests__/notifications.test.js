import { NotificationService } from "../src/services/NotificationService.js";

describe("NotificationService", () => {
  beforeEach(() => {
    global.Notification = {
      permission: "default",
      requestPermission: jest.fn(() => Promise.resolve("granted")),
    };
  });

  afterEach(() => {
    delete global.Notification;
  });

  test("requestPermission should call Notification.requestPermission", async () => {
    await NotificationService.requestPermission();
    expect(global.Notification.requestPermission).toHaveBeenCalled();
  });

  test("notify should create a new Notification when permission is granted", () => {
    global.Notification = jest.fn();
    global.Notification.permission = "granted";

    NotificationService.notify("Test Message");

    expect(global.Notification).toHaveBeenCalledWith("Test Message");
  });
});
