import json
import boto3
from datetime import datetime

sqs = boto3.resource('sqs')

def main(event, _):
  queue = sqs.get_queue_by_name(QueueName='my-event-queue')
  now = datetime.now()
  response = queue.send_message(MessageBody='Message sent at: '+str(now))
  print(response.get('MessageId'))
  print(response.get('MD5OfMessageBody'))
  print(json.dumps(response))


