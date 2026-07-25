async function test() {
  try {
    const res = await fetch("http://localhost:3000/api/stores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test Store API",
        address: "Test",
        lat: 1,
        lng: 1,
        published: true
      })
    });
    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Response:", data);
  } catch (error) {
    console.error("Fetch Error:", error);
  }
}
test();
