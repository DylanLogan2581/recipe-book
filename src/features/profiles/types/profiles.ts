export type PublicProfile = {
  avatarPath: string | null;
  bio: string | null;
  createdAt: string;
  displayName: string;
  updatedAt: string;
  userId: string;
};

export type PublicProfileListItem = Pick<
  PublicProfile,
  "displayName" | "userId"
>;

export type UpdateProfileInput = {
  avatarPath?: string | null;
  bio?: string | null;
  displayName: string;
};
