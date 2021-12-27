import { StepFunction } from "../StepFunction";
import { StepSequence } from "../StepSequence";
import { ExampleAsyncStep } from "./ExampleAsyncStep";
import { ExampleBadStep } from "./ExampleBadStep";
import { ExampleContext } from "./ExampleContext";
import { ExampleHardcodedStep } from "./ExampleHardcodedStep";
import { ExampleSkipStep } from "./ExampleSkipStep";
import { ExampleStep } from "./ExampleStep";

describe("StepSequence", () => {
  describe("new()", () => {
    it("it adds steps", () => {
      const step1 = new ExampleStep();
      const step2 = new ExampleStep();
      const sequence = new StepSequence<ExampleContext>([step1, step2]);
      expect(sequence.steps).toHaveLength(2);
    });
  });

  describe("addStep()", () => {
    it("it add a step correctly", () => {
      const sequence = new StepSequence<ExampleContext>();
      sequence.addStep(new ExampleStep());
      expect(sequence.steps).toHaveLength(1);
    });
  });

  describe("addSteps()", () => {
    it("it add a step correctly", () => {
      const sequence = new StepSequence<ExampleContext>();
      const step1 = new ExampleStep();
      const step2 = new ExampleStep();
      sequence.addSteps([step1, step2]);
      expect(sequence.steps).toHaveLength(2);
    });
  });

  describe("removeStep()", () => {
    it("it add a step correctly", () => {
      const sequence = new StepSequence<ExampleContext>();
      const step = new ExampleStep();
      sequence.addStep(step);
      expect(sequence.steps).toHaveLength(1);
      sequence.removeStep(step);
      expect(sequence.steps).toHaveLength(0);
    });
  });

  describe("removeStepById()", () => {
    it("it add a step correctly", () => {
      const sequence = new StepSequence<ExampleContext>();
      const step = new ExampleStep();
      sequence.addStep(step);
      expect(sequence.steps).toHaveLength(1);
      sequence.removeStepById(step.id);
      expect(sequence.steps).toHaveLength(0);
    });
  });

  describe("clearSteps()", () => {
    it("it add a step correctly", () => {
      const sequence = new StepSequence<ExampleContext>();
      const step = new ExampleStep();
      sequence.addStep(step);
      expect(sequence.steps).toHaveLength(1);
      sequence.clearSteps();
      expect(sequence.steps).toHaveLength(0);
    });
  });

  describe("runSteps()", () => {
    it("it runs all steps correctly", async () => {
      const sequence = new StepSequence<ExampleContext>();
      const step = new ExampleStep();
      sequence.addStep(step);
      const stepAsync = new ExampleAsyncStep();
      sequence.addStep(stepAsync);
      expect(sequence.steps).toHaveLength(2);

      const result = await sequence.runSteps({ count: 0 });
      expect(result.count).toEqual(2);
    });

    it("it runs all enabled steps correctly", async () => {
      const sequence = new StepSequence<ExampleContext>();
      const step1 = new ExampleStep();
      const step2 = new ExampleStep();
      step2.enabled = false;
      sequence.addStep(step1);
      sequence.addStep(step2);
      expect(sequence.steps).toHaveLength(2);

      const result = await sequence.runSteps({ count: 0 });
      expect(result.count).toEqual(1);
    });

    it("it runs all applicable steps correctly", async () => {
      const sequence = new StepSequence<ExampleContext>();
      const step1 = new ExampleStep();
      const step2 = new ExampleSkipStep();
      sequence.addStep(step1);
      sequence.addStep(step2);
      expect(sequence.steps).toHaveLength(2);

      const result = await sequence.runSteps({ count: 0 });
      expect(result.count).toEqual(1);
    });

    it("it runs only the first step when in first mode", async () => {
      const sequence = new StepSequence<ExampleContext>();
      const step1 = new ExampleStep();
      const step2 = new ExampleHardcodedStep();
      sequence.addStep(step1);
      sequence.addStep(step2);
      expect(sequence.steps).toHaveLength(2);

      const result = await sequence.runSteps(
        { count: 0 },
        { sequenceMode: "first" }
      );
      expect(result.count).toEqual(1);
    });

    it("it runs only the first active step when in first mode", async () => {
      const sequence = new StepSequence<ExampleContext>();
      const step1 = new ExampleStep();
      const step2 = new ExampleHardcodedStep();
      step1.enabled = false;
      sequence.addStep(step1);
      sequence.addStep(step2);
      expect(sequence.steps).toHaveLength(2);

      const result = await sequence.runSteps(
        { count: 0 },
        { sequenceMode: "first" }
      );
      expect(result.count).toEqual(15);
    });

    it("it throws on failed steps", async () => {
      const sequence = new StepSequence<ExampleContext>();
      const step = new ExampleBadStep();
      sequence.addStep(step);
      const stepAsync = new ExampleAsyncStep();
      sequence.addStep(stepAsync);
      expect(sequence.steps).toHaveLength(2);

      await expect(() => sequence.runSteps({ count: 0 })).rejects.toThrowError(
        "bad step run"
      );
    });
  });

  describe("StepFunction", () => {
    it("it add a step function correctly", async () => {
      const step = new StepFunction<ExampleContext>((ctx) => {
        ctx.count = ctx.count + 1;
        return ctx;
      });
      const sequence = new StepSequence<ExampleContext>();
      sequence.addStep(step);
      const result = await sequence.runSteps({ count: 0 });
      expect(result.count).toEqual(1);
    });
  });
});
