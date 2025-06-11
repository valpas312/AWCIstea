const API_TOKEN =
  "patdhWEghM3DDKm5u.c1127999a716b968324b960a33484eaa29837975bd9d4da2100fb892ba52c731";
const BASE_ID = "appW1CUN9IIKZOsrb";
const TABLE_NAME = "SoundsLikeMusic";
const API_URL = `https://api.airtable.com/${BASE_ID}/${TABLE_NAME}`;

async function addToAirtable(product) {
  const response = fetch(API_URL, {
    headers: {
      "Authorization": `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(product),
  });
    const data = await response.then(res => res.json());
    console.log(`Product added: ${data.id}`);
    return data;
}
