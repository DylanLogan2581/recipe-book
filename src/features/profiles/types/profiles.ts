export type PublicProfile = {
  avatarPath: string | null;
  bio: string | null;
  createdAt: string;
  displayName: string;
  updatedAt: string;
  userId: string;
};

export type UpdateProfileInput = {
  avatarPath?: string | null;
  bio?: string | null;
  displayName: string;
};
