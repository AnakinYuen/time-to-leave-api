import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import { hash } from 'bcryptjs';
import { connectToDatabase } from '../utils/db';
import Alarm from '../alarm/Alarm';
import { signToken } from '../utils/token';
import { createErrorResponse, createAuthSuccessRespone } from '../utils/response';

interface EventBody {
  mode: 'arrive' | 'leave';
  period: number;
  password: string;
  expireAt: string;
}

const checkIfInputIsValid = (eventBody: EventBody) => {
  if (!(eventBody.password && eventBody.password.length >= 7)) {
    throw new Error('Password error. Password needs to be longer than 8 characters.');
  }

  if (!(eventBody.expireAt && typeof eventBody.expireAt === 'string')) {
    throw new Error('ExpireAt error. ExpireAt must have valid characters.');
  }
};

const register = async (eventBody: EventBody) => {
  await checkIfInputIsValid(eventBody);
  const hashedPassword = await hash(eventBody.password, 8);
  const alarm = await Alarm.create({
    mode: eventBody.mode,
    period: eventBody.period,
    password: hashedPassword,
    expireAt: eventBody.expireAt,
  });
  const expireAt = new Date(eventBody.expireAt).getTime();
  return signToken({ id: alarm._id, expireAt, mode: alarm.mode, period: alarm.period });
};

export const handler: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async (
  event,
  context,
) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    if (!event.body) {
      throw new Error('Missing body');
    }

    await connectToDatabase();
    const token = await register(JSON.parse(event.body) as EventBody);
    return createAuthSuccessRespone(token);
  } catch ({ stack, ...err }) {
    return createErrorResponse(err);
  }
};

export default handler;
