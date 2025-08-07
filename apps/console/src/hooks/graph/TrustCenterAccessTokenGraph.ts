import { graphql } from 'react-relay';

export const trustCenterByIdQuery = graphql`
  query TrustCenterAccessTokenGraphQuery($trustCenterId: ID!) {
    node(id: $trustCenterId) {
      ... on TrustCenter {
        id
        slug
        active
        organization {
          id
          name
        }
      }
    }
  }
`;
