import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { MyQueue } from "./utils/my-queue";
import { ReceiverLambda } from "./utils/receiver-lambda";
import { SenderLambda } from "./utils/sender-lambda";
// import * as sqs from 'aws-cdk-lib/aws-sqs';
export class SqsAppStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const myQueue = new MyQueue({ scope: this, id: "my-event" });

    new SenderLambda({
      scope: this,
      id: "send-event",
      onSuccessQueue: myQueue.getQueue(),
    });

    new ReceiverLambda({
      scope: this,
      id: "receive-event",
      eventQueue: myQueue.getQueue(),
    });
  }
}
