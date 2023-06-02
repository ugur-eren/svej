// This list does not contain all of the possible HTTP status codes
// This is only the ones that I ever used and possibly may use

export default {
  OK: 200,
  Created: 201,
  Accepted: 202,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,

  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  NotAcceptable: 406,
  Timeout: 408,
  Gone: 410,
  TooManyRequests: 429,

  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
};
