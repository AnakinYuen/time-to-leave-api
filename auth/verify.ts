import { APIGatewayTokenAuthorizerEvent, APIGatewayAuthorizerResult, Handler } from 'aws-lambda';
import { verify } from 'jsonwebtoken';
import { Payload } from '../utils/token';

// Policy helper function
const generatePolicy = (principalId, effect, resource): APIGatewayAuthorizerResult => ({
  principalId,
  policyDocument: {
    Version: '2012-10-17',
    Statement:
      effect && resource
        ? [
            {
              Action: 'execute-api:Invoke',
              Effect: effect,
              Resource: resource,
            },
          ]
        : [],
  },
});

export const handler: Handler<APIGatewayTokenAuthorizerEvent, APIGatewayAuthorizerResult> = (
  event,
  _,
  callback,
) => {
  // check header or url parameters or post parameters for token
  const token = event.authorizationToken;

  if (!token) {
    return callback('Unauthorized');
  }

  // verifies secret and checks exp
  verify(token, process.env.JWT_SECRET!, (err, decoded: Payload) => {
    if (err || !decoded) {
      return callback('Unauthorized');
    }

    // if everything is good, save to request for use in other routes
    return callback(null, generatePolicy(decoded.id, 'Allow', event.methodArn));
  });
};

export default handler;
