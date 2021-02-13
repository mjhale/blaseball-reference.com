// @ts-expect-error Unable to find declaration error
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require("@zeit/fetch-retry")(require("node-fetch"));

export default async function apiFetcher(
  // @ts-expect-error Implicit any error
  endpoint,
  { useDatabase = false } = {}
) {
  let url;

  try {
    url = new URL(endpoint);
  } catch (_err) {
    if (useDatabase) {
      url = `${process.env.NEXT_PUBLIC_DATABLASE_API_URL}${endpoint}`;
    } else {
      url = `${process.env.NEXT_PUBLIC_BLASEBALL_REFERENCE_API_URL}${endpoint}`;
    }
  }

  const res = await fetch(url);

  if (res.status >= 400 && res.status <= 499) {
    throw new Error(`Fetch error: ${res.status}`);
  }

  return await res.json();
}

// @ts-expect-error Implicit any error
export function dbApiFetcher(url) {
  return apiFetcher(url, { useDatabase: true });
}
