export const listPostsWithUser = /* GraphQL */ `
  query ListPosts(
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPosts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        type
        content
        owner
        createdAt
        updatedAt
        user {
          id
          username
          email
          bio
          avatar
        }
        comments {
          items {
            id
            content
            owner
            createdAt
          }
          nextToken
        }
        likes {
          items {
            id
            owner
          }
          nextToken
        }
      }
      nextToken
    }
  }
`;
