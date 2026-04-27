// Mock user data for demo purposes
export async function getUser() {
  return {
    id: "demo-user-123",
    email: "demo@geiger.app",
    user_metadata: {
      full_name: "Demo User",
      avatar_url: null,
    },
  };
}
