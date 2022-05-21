import { Code, Function as Lambda, Runtime } from "aws-cdk-lib/aws-lambda";
import { SqsDestination } from "aws-cdk-lib/aws-lambda-destinations";
import { IQueue } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";
import { join } from "path";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { PolicyStatement, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";

interface ISenderInput {
  scope: Construct;
  id: string;
  onSuccessQueue: IQueue;
}

export class SenderLambda {
  lambda: Lambda;

 

  constructor({ scope, id, onSuccessQueue }: ISenderInput) {
    const role = new Role(scope, "SendMessage", {
        roleName: "SendEventRole",
        assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
      });
    
      role.addToPolicy(
        new PolicyStatement({
          resources: ["*"],
          actions: [
            "sqs:GetQueueAttributes",
            "sqs:ReceiveMessage",
            "sqs:SendMessage",
            "kms:Decrypt",
          ],
        })
      );
    this.lambda = new Lambda(scope, id, {
      functionName: `${id}-lambda`,
      runtime: Runtime.PYTHON_3_9,
      handler: "handler.main",
      code: Code.fromAsset(
        join(__dirname, "..", "..", "Lambdas", "send-envent-lambda", "core")
      ),
    //   role: role,
      onSuccess: new SqsDestination(onSuccessQueue),
    });


  }

  getLambda() {
    return this.lambda;
  }
}
