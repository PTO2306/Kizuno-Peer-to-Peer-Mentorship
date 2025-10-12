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

export type ListingType = 'Mentor' | 'Mentee';

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export type Availability =
  | 'Anytime'
  | 'Weekdays'
  | 'Weekends'
  | 'Evenings'
  | 'Mornings'
  | 'Afternoons';

export type Mode = 'Online' | 'InPerson' | 'Hybrid';

export type RequestStatus = 'Pending' | 'Accepted' | 'Declined';

export interface TagsModel {
  id?: string;
  name: string;
}

export interface ListingModel {
  id?: string;
  displayName: string;
  profilePictureUrl?: string;
  title: string;
  subtitle?: string;
  description?: string;
  type: ListingType;
  skillLevel?: SkillLevel;
  availability?: Availability;
  mode?: Mode;
  tags: TagsModel[];
  createdAt?: string;
  updatedAt?: string;
  isOwner: boolean
  connectionRequests?: ConnectionRequestModel[];
}

export interface ConnectionRequestModel {
  listingId: string;
  senderId: string;
  displayName: string;
  profilePictureUrl?: string;
  status: RequestStatus;
  message?: string;
}

export interface FetchListingsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  type?: string;
  tagNames?: string[];
  reset?: boolean;
}


