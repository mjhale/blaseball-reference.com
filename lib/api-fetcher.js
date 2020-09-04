export default async function apiFetcher(endpoint) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BLASEBALL_REFERENCE_API_URL}${endpoint}`
  );

  if (res.status >= 400 && res.status <= 499) {
    throw new Error(`Fetch error: ${res.status}`);
  }

  return await res.json();
}
