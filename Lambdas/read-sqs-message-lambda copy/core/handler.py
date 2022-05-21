import json
import boto3

sqs = boto3.resource('sqs')

def main(event, _):
  queue = sqs.get_queue_by_name(QueueName='test')
  print('Sending message....')



