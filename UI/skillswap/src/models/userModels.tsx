export interface LoginModel {
  email: string;
  password: string;
}

export interface ProfileModel {
  displayName: string;
  bio?: string;
  city?: string;
  country?: string;
  skills?: string[];
  profilePictureUrl?: string;
}
