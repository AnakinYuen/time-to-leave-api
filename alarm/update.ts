import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import Alarm from './Alarm';
import { connectToDatabase } from '../utils/db';
import { createErrorResponse, createAuthSuccessRespone } from '../utils/response';
import { signToken } from '../utils/token';

interface EventBody {
  period: number;
  expireAt: string;
}

const update = async (alarmId: string, expireAt: string, period: number) => {
  const alarm = await Alarm.findById(alarmId);
  if (!alarm) {
    throw new Error('No alarm found.');
  }
  alarm.expireAt = new Date(expireAt);
  alarm.period = period;
  return await alarm.save();
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
    if (!(event.requestContext.authorizer && event.requestContext.authorizer.principalId)) {
      throw new Error('Missing authorizer id');
    }
    await connectToDatabase();
    const { expireAt, period } = JSON.parse(event.body) as EventBody;
    const alarm = await update(event.requestContext.authorizer.principalId, expireAt, period);
    return createAuthSuccessRespone(
      signToken({
        id: alarm._id,
        expireAt: alarm.expireAt.getTime(),
        mode: alarm.mode,
        period: alarm.period,
      }),
    );
  } catch (err) {
    return createErrorResponse(err);
  }
};

export default handler;
