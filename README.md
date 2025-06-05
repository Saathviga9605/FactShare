# FactShare

**FactShare** is a fake news verification platform designed to help users detect misinformation by analyzing both text and image-based news content. The application uses machine learning APIs to calculate a credibility percentage and allows users to engage in a community by upvoting or downvoting trustworthy articles.

## Features

- Detects fake news from both **text input** and **images** (like newspaper clippings)
- Displays a **credibility percentage** to indicate how likely the news is fake or real
- Users can **register and login**
- Articles with credibility above **75%** are published in a community feed
- Community members can **upvote or downvote** articles based on their judgment

## Tech Stack

This project is built using **React** for the frontend and **Flask** for the backend. It connects to a **MongoDB** database for storing user data and articles. The app uses an **external API** for fake news detection and **OCR (Optical Character Recognition)** to extract text from uploaded news images.

## How to Use?

1. Register or login as a user.

2. Enter a news text or upload an image.

3. View the credibility percentage.

4. If the score is above 75%, the article is shared on the community feed.

5. Read, upvote, or downvote others’ posts to keep the community clean and aware.
   
**Developed in an attempt to raise awareness in this society.**
