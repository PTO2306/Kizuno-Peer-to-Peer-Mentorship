export interface LoginModel {
  email: string;
  password: string;
}

export interface SkillModel {
  name: string;
  isTeaching: boolean;
}

export interface ProfileModel {
  displayName: string;
  bio?: string;
  city?: string;
  country?: string;
  skills?: SkillModel[];
  profilePictureUrl?: string;
}

export interface TagsModel {
  name: string;
}

export interface ListingModel {
  title: string;
  description: string;
  tags: TagsModel[];
}


