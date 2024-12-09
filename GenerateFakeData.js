const sampleListings = Array.from({ length: 30 }, (_, index) => ({
  title: `Listing Title ${index + 1}`,
  description: `This is the description for listing ${index + 1}, a great opportunity to explore.`,
  price: Math.floor(Math.random() * 1000) + 100, // Random price between 100 and 1100
  location: `Location ${index + 1}`,
  image : "none",
  country: ["USA", "UK", "Canada", "Australia", "India"][
    Math.floor(Math.random() * 5)
  ], // Random country from a set of 5
}));

console.log(sampleListings);