export async function fetchData({ funcName, token }) {
  return fetch(`/api/${funcName}`, {
    headers: { "x-custom-authorization": `Bearer ${token}` },
  }).then((response) => response.json());
}
