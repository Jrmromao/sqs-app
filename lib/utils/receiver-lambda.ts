import { PolicyStatement, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { Code, Function as Lambda, Runtime } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { join } from "path";

interface IReceiverInput {
  scope: Construct;
  id: string;
}

export class ReceiverLambda {
  lambda: Lambda;

  constructor({ scope, id }: IReceiverInput) {
    const role = new Role(scope, "ReadMessage", {
      roleName: "ReadEventRole",
      assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
      
    });

    role.addToPolicy(
      new PolicyStatement({
        resources: ["*"],
        actions: [
          "sqs:*",
          "kms:Decrypt",
          "cloudwatch:*",
          "logs:*",
          "iam:GetPolicy",
          "iam:GetPolicyVersion",
          "iam:GetRole",
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
  }

  getLambda() {
    return this.lambda;
  }
}
