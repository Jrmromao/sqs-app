import { PolicyStatement, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { Code, Function as Lambda, Runtime } from "aws-cdk-lib/aws-lambda";
import { IQueue } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";
import { join } from "path";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";

interface IReceiverInput {
  scope: Construct;
  id: string;
  eventQueue: IQueue;
}

export class ReceiverLambda {
  lambda: Lambda;

  constructor({ scope, id, eventQueue }: IReceiverInput) {
    const role = new Role(scope, "ReadMessage", {
      roleName: "ReadEventRole",
      assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
    });

    role.addToPolicy(
      new PolicyStatement({
        resources: ["*"],
        actions: [
          "sqs:GetQueueAttributes",
          "sqs:ReceiveMessage",
          "kms:Decrypt",
        ],
      })
    );

    this.lambda = new Lambda(scope, id, {
      functionName: `${id}-lambda`,
      runtime: Runtime.PYTHON_3_9,
      handler: "handler.main",
      code: Code.fromAsset(
        join(
          __dirname,
          "..",
          "..",
          "Lambdas",
          "read-sqs-message-lambda copy",
          "core"
        )
      ),
      role: role,
    });
  
    const eventSource = new  SqsEventSource(eventQueue);
    this.lambda.addEventSource(eventSource);
  
  }

  getLambda() {
    return this.lambda;
  }
}
