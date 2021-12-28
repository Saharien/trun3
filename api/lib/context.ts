export function buildResponseContext({
  status,
  code,
  data,
  message,
}: buildResponseContextParams): Record<string, any> {
  let responseContext: Record<string, any> = {
    status: status || 200,
    body: { code: code || 0 },
    headers: {
      "content-type": "application/json",
    },
  };

  if (data) responseContext.body.data = data;
  if (message) responseContext.body.message = message;

  return responseContext;
}

type buildResponseContextParams = {
  status?: number;
  code?: number;
  data?: Record<string, any>;
  message?: string;
};
