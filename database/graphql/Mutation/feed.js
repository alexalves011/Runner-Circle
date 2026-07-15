import { gql } from "@apollo/client";

export const ADD_FEED_POST = gql`
  mutation AddFeedPost(
    $user: JSON!         
    $time: Int!          
    $stats: JSON!        
    $workout: String!     # <-- Alterado para workout!
    $description: String! 
    $timestamp: String!   
  ) {
    createFeed(
      user: $user
      time: $time
      stats: $stats
      workout: $workout   # <-- Alterado para workout!
      description: $description
      timestamp: $timestamp
    ){
      id
      user
      time
      stats
      workout             # <-- Alterado para workout!
      description
      timestamp  
    }
  }
`;