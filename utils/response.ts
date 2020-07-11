import { APIGatewayProxyResult } from 'aws-lambda';

interface ErrorResponse extends Error {
  statusCode?: number;
}

type Response = Partial<Pick<APIGatewayProxyResult, 'statusCode' | 'headers'>>;

const AccessControlAllowOriginHeader = {
  'Access-Control-Allow-Origin': '*',
};

export const createErrorResponse = ({
  statusCode = 500,
  stack,
  message,
}: ErrorResponse): APIGatewayProxyResult => ({
  statusCode,
  headers: {
    ...AccessControlAllowOriginHeader,
    'Content-Type': 'text/plain',
  },
  body: JSON.stringify({ stack, message }),
});

export const createSuccessRespone = (
  body: string,
  { statusCode = 200, headers }: Response = {},
): APIGatewayProxyResult => ({
  statusCode,
  headers: {
    ...AccessControlAllowOriginHeader,
    ...headers,
  },
  body,
});

export const createAuthSuccessRespone = (token: string): APIGatewayProxyResult => ({
  statusCode: 200,
  headers: AccessControlAllowOriginHeader,
  body: JSON.stringify({ auth: true, token }),
});
