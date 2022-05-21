import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { MyQueue } from "./utils/my-queue";
import { ReceiverLambda } from "./utils/receiver-lambda";
import { SenderLambda } from "./utils/sender-lambda";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";

export class SqsAppStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const eventQueue = new MyQueue({ scope: this, id: "my-event" });

    new SenderLambda({
      scope: this,
      id: "send-event",
      onSuccessQueue: eventQueue.getQueue(),
    });

   const receiverLambda = new ReceiverLambda({
      scope: this,
      id: "receive-event"
    });

    const eventSource = new  SqsEventSource(eventQueue.getQueue());
    receiverLambda.getLambda().addEventSource(eventSource);
  }
}
