// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require("@zeit/fetch-retry")(require("node-fetch"));

export default async function apiFetcher(
  endpoint,
  { useDatabase = false } = {}
) {
  let url;

  try {
    url = new URL(endpoint);
  } catch (_err) {
    if (useDatabase) {
      url = `${process.env.NEXT_PUBLIC_DATABLASE_API}${endpoint}`;
    } else {
      url = `${process.env.NEXT_PUBLIC_BLASEBALL_REFERENCE_API}${endpoint}`;
    }
  }

  const res = await fetch(url);

  if (res.status >= 400 && res.status <= 499) {
    const error = new Error(`Fetch error: ${res.status}`);
    throw error;
  }

  return await res.json();
}

export function dbApiFetcher(url) {
  return apiFetcher(url, { useDatabase: true });
}
