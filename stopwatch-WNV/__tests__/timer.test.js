import { Timer } from "../src/components/Timer.js";

test("Stopwatch mode counts up correctly", () => {
  const timer = new Timer(0, "stopwatch");
  timer.tick();
  expect(timer.remaining).toBe(1);
});

test("Countdown mode counts down and triggers onFinish", (done) => {
  const timer = new Timer(2, "countdown");
  timer.onFinish = () => {
    expect(timer.remaining).toBe(0);
    done();
  };
  timer.start();
});

test("Format time is correct", () => {
  const timer = new Timer(3661, "countdown");
  expect(timer.formatTime()).toBe("01:01:01");
});
