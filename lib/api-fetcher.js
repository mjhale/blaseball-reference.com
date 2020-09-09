export default async function apiFetcher(endpoint) {
  let url;

  try {
    url = new URL(endpoint);
  } catch (_err) {
    url = `${process.env.NEXT_PUBLIC_BLASEBALL_REFERENCE_API_URL}${endpoint}`;
  }

  const res = await fetch(url);

  if (res.status >= 400 && res.status <= 499) {
    throw new Error(`Fetch error: ${res.status}`);
  }

  return await res.json();
}
