export default async function apiFetcher(endpoint) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BLASEBALL_REFERENCE_API_URL}${endpoint}`
  );

  return res.json();
}
