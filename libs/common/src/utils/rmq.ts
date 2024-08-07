import { Transport } from '@nestjs/microservices';
import { CustomRMQClientProxy } from '../errors';
import { QueueNames } from '../enums';

const queueOptions = {
  durable: false,
};

type RMQConfig = {
  urls: string[];
  queue: QueueNames;
};

export const getRMQOptions = ({ urls, queue }: RMQConfig) => {
  return {
    transport: Transport.RMQ,
    options: {
      urls,
      queue,
      queueOptions,
      persistent: true,
    },
  };
};

export const getConnectedRmqClient = async ({ urls, queue }: RMQConfig) => {
  const client = new CustomRMQClientProxy({
    urls,
    queue,
    queueOptions,
  });
  await client.connect();
  return client;
};
