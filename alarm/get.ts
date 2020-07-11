import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import Alarm from './Alarm';
import { connectToDatabase } from '../utils/db';
import { createErrorResponse, createSuccessRespone } from '../utils/response';

const handler: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    if (!(event.queryStringParameters && event.queryStringParameters.id)) {
      throw new Error('Missing query parameter');
    }
    await connectToDatabase();
    const alarm = await Alarm.findById(event.queryStringParameters.id);
    if (!alarm) {
      throw new Error('No alarm found.');
    }
    return createSuccessRespone(JSON.stringify({ expireAt: alarm.expireAt }));
  } catch (err) {
    return createErrorResponse(err);
  }
};

export default handler;
