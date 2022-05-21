import json
import boto3

sqs = boto3.resource('sqs')

def main(event, _):
  queue = sqs.get_queue_by_name(QueueName='my-event-queue')
  print('Sending message....')
  response = queue.send_message(MessageBody='This a sample message!')
  print(response.get('MessageId'))
  print(response.get('MD5OfMessageBody'))
  print(json.dumps(response))


