# Product Requirements Document: Stride & Soul (MVP)

## 1. Project Overview

* **Vision**: To help users discover the "hidden link" between their physical movement and their mental well-being through effortless tracking and AI-powered reflection.
* **Target Audience**: Individuals seeking to improve their mental health, people with sedentary jobs, and "data-curious" wellness enthusiasts.
* **Key Value Prop**: Unlike standard step trackers, Stride & Soul provides the context behind the numbers, showing how 2,000 steps vs. 10,000 steps directly impacts the user's emotional state.

## 2. Core Features (MVP)

* **Mood Logging**: A simple daily interface where users select an emoji (e.g., Happy, Numb, Anxious) to represent their day.
* **Step Integration**: Automatic syncing with Google Health Connect or Apple HealthKit to pull daily step counts.
* **AI Journaling**: A text-entry field for "Brain Dumps." The AI analyzes this text for sentiment and identifies activities.
* **Correlation Dashboard**: A weekly view featuring a dual-axis chart comparing Mood Score (Y1) against Step Count (Y2).
* **Insight Engine**: A daily "Post-Journal" summary that explains the correlation found between the user's movement and their words.

## 3. User Stories

* As a user, I want my steps to sync automatically so I don't have to remember to type them in.
* As a user, I want to see a chart at the end of the week so I can prove to myself that walking actually makes me feel better.
* As a user, I want my journal entries to be private and secure.

## 4. Technical Requirements

* **Platform**: Responsive Web App (Next.js or React recommended).
* **Database**: Supabase or Firebase for user profiles and encrypted journal entries.
* **APIs**:
  * Google Health Connect: For physical activity data.
  * Gemini API: For sentiment analysis and insight generation.

## 5. Success Metrics (KPIs)

* **Retention**: % of users who log mood 4+ days in a single week.
* **Correlation Clarity**: % of users who click "This insight was helpful" on the AI summary.
* **Conversion**: Number of users who increase their step count by >10% after seeing a "low-mood/low-step" correlation chart.
