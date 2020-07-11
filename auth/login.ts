import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import { compare } from 'bcryptjs';
import Alarm, { Alarm as AlarmDocument } from '../alarm/Alarm';
import { connectToDatabase } from '../utils/db';
import { signToken } from '../utils/token';
import { createErrorResponse, createAuthSuccessRespone } from '../utils/response';

interface EventBody {
  id: string;
  password: string;
}

const comparePassword = async (
  eventPassword: string,
  alarmPassword: string,
  alarm: AlarmDocument,
) => {
  const passwordIsValid = await compare(eventPassword, alarmPassword);
  if (!passwordIsValid) {
    throw new Error('The credentials do not match.');
  }
  return signToken({
    id: alarm._id,
    expireAt: alarm.expireAt.getTime(),
    mode: alarm.mode,
    period: alarm.period,
  });
};

const login = async ({ id, password }: EventBody) => {
  const alarm = await Alarm.findById(id);
  if (!alarm) {
    throw new Error('Alarm with that id does not exits.');
  }
  return await comparePassword(password, alarm.password, alarm);
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
    const token = await login(JSON.parse(event.body) as EventBody);
    return createAuthSuccessRespone(token);
  } catch (err) {
    return createErrorResponse(err);
  }
};

export default handler;
