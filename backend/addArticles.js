// backend/addArticles.js
require("dotenv").config({ path: "../.env" }); // Load .env from the parent directory (NEWSFRONT/)
const mongoose = require("mongoose");

// Debug the MONGO_URI to ensure it's loaded
console.log("MONGO_URI:", process.env.MONGO_URI);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err);
    process.exit(1);
  });

// Define Article Schema (aligned with the Article model in server.js)
const articleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  credibilityScore: {
    type: Number,
    default: 0,
  },
  submissionDate: {
    type: Date,
    default: Date.now,
  },
});

// Define CommunityArticle Schema (aligned with the CommunityArticle model in server.js)
const communityArticleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  credibilityScore: {
    type: Number,
    required: true,
  },
  submissionDate: {
    type: Date,
    default: Date.now,
  },
  votes: {
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
  },
  voters: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      voteType: { type: String, enum: ["upvote", "downvote"] },
    },
  ],
});

// Create Models
const Article = mongoose.model("Article", articleSchema);
const CommunityArticle = mongoose.model("CommunityArticle", communityArticleSchema);

// Data to Insert
const articles = [
  {
    userId: "000000000000000000000000", // Placeholder userId (replace with a valid ObjectId from your users collection)
    type: "text",
    title: "AI Revolution: Impact on Jobs",
    credibilityScore: 85,
    content:
      "Artificial Intelligence is reshaping industries at an unprecedented rate. While AI enhances efficiency and automates tasks, it raises concerns about job displacement. Studies indicate that AI will replace some routine jobs, but it will also create new roles in AI development, cybersecurity, and data analysis. The future job market will require employees to adapt, learning AI-related skills to stay competitive. Many experts argue that AI won't entirely replace human workers but will complement human capabilities. The impact of AI depends on how industries integrate these technologies while ensuring job transitions for workers.",
  },
  {
    userId: "000000000000000000000000", // Placeholder userId (replace with a valid ObjectId)
    type: "text",
    title: "Climate Change: Fact or Fiction?",
    credibilityScore: 92,
    content:
      "Climate change is a scientifically established phenomenon with overwhelming evidence supporting its existence. The rise in global temperatures, melting ice caps, and extreme weather events provide clear indicators of climate change. NASA and the IPCC report that human activities, particularly the burning of fossil fuels, have significantly contributed to global warming. Skeptics argue that climate variations have occurred naturally, but modern data links rapid changes directly to human influence. Governments and organizations worldwide are implementing policies to combat climate change, emphasizing renewable energy, carbon footprint reduction, and conservation efforts.",
  },
  {
    userId: "000000000000000000000000", // Placeholder userId (replace with a valid ObjectId)
    type: "text",
    title: "Electric Vehicles: Are They Sustainable?",
    credibilityScore: 78,
    content:
      "Electric Vehicles (EVs) are often promoted as the future of sustainable transportation, but their impact is more complex than it seems. EVs significantly reduce carbon emissions compared to gasoline-powered cars, yet challenges exist in battery production and disposal. Lithium-ion batteries require rare minerals like lithium and cobalt, leading to environmental concerns about mining practices. However, advances in battery technology and recycling methods are addressing these challenges. Countries investing in renewable energy sources make EVs even more eco-friendly. The long-term sustainability of EVs depends on advancements in clean energy and battery innovation.",
  },
];

// Insert Data into MongoDB
const insertArticles = async () => {
  try {
    // Clear existing articles (optional, remove if you don't want to clear)
    await Article.deleteMany({});
    await CommunityArticle.deleteMany({});

    // Insert into articles collection
    await Article.insertMany(articles);
    console.log("Articles inserted successfully into articles collection!");

    // Filter articles with credibilityScore > 75 and insert into communityArticles
    const communityArticles = articles
      .filter((article) => article.credibilityScore > 75)
      .map((article) => ({
        userId: article.userId,
        type: article.type,
        title: article.title,
        content: article.content,
        credibilityScore: article.credibilityScore,
        submissionDate: article.submissionDate || new Date(),
        votes: { upvotes: 0, downvotes: 0 },
        voters: [],
      }));

    if (communityArticles.length > 0) {
      await CommunityArticle.insertMany(communityArticles);
      console.log("Articles inserted successfully into communityArticles collection!");
    } else {
      console.log("No articles with credibilityScore > 75 to insert into communityArticles.");
    }

    mongoose.connection.close();
  } catch (err) {
    console.error("Error inserting articles:", err);
    mongoose.connection.close();
  }
};

insertArticles();