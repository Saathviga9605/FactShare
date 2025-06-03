import React, { useState } from "react";
import "../styles/global.css";

const articles = [
  { 
    title: "The Reality of Climate Change", 
    credibility: 95, 
    content: "Climate change is not a myth but a scientifically proven phenomenon. The Intergovernmental Panel on Climate Change (IPCC) states that the Earth's temperature has risen by 1.1°C since the late 19th century due to human activities, mainly burning fossil fuels. NASA confirms that 2023 was one of the hottest years on record, with extreme heatwaves, rising sea levels, and melting glaciers.\n\nOne of the strongest pieces of evidence for climate change is the increase in carbon dioxide levels. The Mauna Loa Observatory in Hawaii has recorded a CO2 concentration of over 420 ppm—higher than at any point in human history. Scientists attribute rising temperatures to the greenhouse effect, where gases trap heat in the atmosphere, disrupting weather patterns.\n\nDespite misinformation suggesting climate change is a 'natural cycle,' scientific consensus overwhelmingly supports human-driven climate change. Renewable energy sources like solar and wind, as well as reduced deforestation, are critical solutions to mitigate global warming. Global initiatives, including the Paris Agreement, aim to limit temperature rise to below 1.5°C to prevent catastrophic consequences."
  },
  { 
    title: "COVID-19 Vaccines: Are They Safe?", 
    credibility: 92, 
    content: "COVID-19 vaccines developed by Pfizer-BioNTech, Moderna, and AstraZeneca have undergone rigorous testing and have been proven safe and effective. The World Health Organization (WHO) and the Centers for Disease Control and Prevention (CDC) confirm that vaccines reduce the risk of severe illness and death by more than 90%.\n\nA common myth suggests that vaccines were developed 'too fast' to be safe. However, mRNA technology had been in development for over a decade before COVID-19, allowing rapid deployment. Clinical trials included thousands of participants, ensuring that side effects were minimal and temporary, such as fever, fatigue, and soreness at the injection site.\n\nResearch from The Lancet estimates that vaccines prevented over 14 million deaths worldwide in their first year of distribution. Some people claim vaccines alter DNA or cause infertility, but no scientific evidence supports these claims. Instead, studies show that vaccinated individuals have significantly lower hospitalization rates."
  },
  { 
    title: "The Truth About 5G and Health Risks", 
    credibility: 88, 
    content: "As 5G networks expand globally, conspiracy theories linking 5G radiation to cancer and COVID-19 have emerged. However, scientific studies conducted by the World Health Organization (WHO), the U.S. Federal Communications Commission (FCC), and the International Commission on Non-Ionizing Radiation Protection (ICNIRP) confirm that 5G is safe.\n\nUnlike ionizing radiation (such as X-rays or gamma rays), 5G uses non-ionizing radio waves that do not have enough energy to damage human DNA. The frequency range of 5G (24 GHz – 100 GHz) is well within safety limits. The American Cancer Society has stated there is no conclusive evidence linking 5G or any previous cellular technology to cancer.\n\nThe myth that 5G spreads COVID-19 originated in early 2020, falsely suggesting that radio waves weaken the immune system. However, viruses spread through respiratory droplets, not electromagnetic waves. WHO has repeatedly debunked these claims, emphasizing that 5G poses no health risks."
  },
  { 
    title: "Electric Vehicles: Are They Truly Green?", 
    credibility: 85, 
    content: "Electric vehicles (EVs) are widely seen as a sustainable alternative to gasoline-powered cars, but are they truly better for the environment? Studies from the International Energy Agency (IEA) and MIT Climate Portal confirm that EVs produce 50% fewer lifetime carbon emissions than gas-powered cars, even when factoring in battery production.\n\nOne major concern is lithium-ion battery manufacturing, which requires mining materials like lithium, cobalt, and nickel. Extracting these minerals has environmental and ethical concerns, particularly in countries like the Democratic Republic of the Congo. However, ongoing research into battery recycling and solid-state batteries aims to reduce the environmental impact.\n\nEVs charged with electricity from coal-based grids can have a higher carbon footprint than expected. However, as renewable energy adoption increases, EVs will become even cleaner over time. Countries like Norway, where 90% of electricity comes from hydropower, show that EVs can run with near-zero emissions."
  },
  { 
    title: "Artificial Intelligence: Will It Replace Human Jobs?", 
    credibility: 80, 
    content: "The rise of artificial intelligence (AI) has sparked fears of mass unemployment, with some claiming that automation will replace human workers entirely. While AI and robotics will eliminate some repetitive jobs, they will also create new opportunities in fields like data science, cybersecurity, and AI ethics.\n\nA report by the World Economic Forum (WEF) predicts that by 2025, AI will displace 85 million jobs but create 97 million new ones. Jobs in manufacturing, customer service, and transportation may see automation, but AI lacks human creativity, emotional intelligence, and problem-solving skills—qualities essential for leadership, healthcare, and research.\n\nRather than fearing AI, experts suggest upskilling the workforce through education in coding, AI ethics, and automation management. Governments and industries must adapt policies to ensure a smooth transition, emphasizing human-AI collaboration rather than replacement."
  }
];

const Community = () => {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [votes, setVotes] = useState({}); // Store votes for each article

  const handleVote = (title, type) => {
    setVotes((prevVotes) => {
      const newVotes = { ...prevVotes }; // Create a new copy

      if (!newVotes[title]) {
        newVotes[title] = { upvotes: 0, downvotes: 0, userVote: 0 };
      } else {
        newVotes[title] = { ...newVotes[title] }; // Ensure a new object
      }

      if (type === "up") {
        if (newVotes[title].userVote === 1) {
          newVotes[title].upvotes -= 1;
          newVotes[title].userVote = 0;
        } else {
          if (newVotes[title].userVote === -1) {
            newVotes[title].downvotes -= 1;
          }
          newVotes[title].upvotes += 1;
          newVotes[title].userVote = 1;
        }
      } else {
        if (newVotes[title].userVote === -1) {
          newVotes[title].downvotes -= 1;
          newVotes[title].userVote = 0;
        } else {
          if (newVotes[title].userVote === 1) {
            newVotes[title].upvotes -= 1;
          }
          newVotes[title].downvotes += 1;
          newVotes[title].userVote = -1;
        }
      }
      return newVotes;
    });
  };

  return (
    <div className="community-container">
      <br/>
      <br/>
      <br/>
      <br/>

      {!selectedArticle ? (
        <>
          <h2 className="community-title">APPROVED ARTICLES</h2>
          <p className="community-subtitle">Explore fact-checked articles with credibility scores</p>
          <div className="articles-grid">
            {articles.map((article, index) => (
              <div key={index} className="article-card" onClick={() => setSelectedArticle(article)}>
                <h3 className="article-title">{article.title}</h3>
                <p className="credibility-score">Credibility Score: {article.credibility}%</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="article-view">
          <button className="back-button" onClick={() => setSelectedArticle(null)}>← Back</button>
          <h2 className="article-title">{selectedArticle.title}</h2>
          <p className="credibility-score">Credibility Score: {selectedArticle.credibility}%</p>
          <p className="article-content">{selectedArticle.content}</p>

          {/* Voting Buttons */}
          <div className="vote-buttons">
            <button 
              className={`vote-btn upvote ${votes[selectedArticle.title]?.userVote === 1 ? "active" : ""}`} 
              onClick={() => handleVote(selectedArticle.title, "up")}
            >
              👍 {votes[selectedArticle.title]?.upvotes || 0}
            </button>

            <button 
              className={`vote-btn downvote ${votes[selectedArticle.title]?.userVote === -1 ? "active" : ""}`} 
              onClick={() => handleVote(selectedArticle.title, "down")}
            >
              👎 {votes[selectedArticle.title]?.downvotes || 0}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;
