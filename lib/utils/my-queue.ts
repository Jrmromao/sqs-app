import { IQueue, Queue, QueueEncryption } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";

interface IMyQueueInput {
  scope: Construct;
  id: string;
}

export class MyQueue {
  queue: IQueue;

  constructor({ scope, id }: IMyQueueInput) {
    this.queue = new Queue(scope, id, {
      queueName: `${id}-queue`,
      encryption: QueueEncryption.KMS,
    });
  }
  getQueue() {
    return this.queue;
  }
}
