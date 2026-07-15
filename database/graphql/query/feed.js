import { gql } from "@apollo/client";

export const GET_FEED = gql`
  query GetFeed {
    allFeeds {
      id
      user
      time
      stats
      workout     # <-- Voltou para 'workout'
      description
      timestamp
    }
  }
`;

export const GET_FEED_BY_CATEGORY = gql`
  query GetFeedByCategory($category: String) {
    allFeeds(filter: { workout: $category }) { # <-- Filtra pelo campo 'workout'
      id
      user
      time
      stats
      workout     # <-- Voltou para 'workout'
      description
      timestamp
    }
  }
`;