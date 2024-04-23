export interface IIdentityClaims {
  email: string;
  family_name: string;
  gender: string;
  given_name: string;
  h21pro_user_id: number;
  middle_name: string;
  name: string;
  role: string[] | string;
  user_profile_id: number;
  wl_profile_id: number;
  registration_date: Date;
  update_date: Date;
  sub: string;
  picture_url: string;
  picture: string;
  first_name: string;
  last_name: string;
  company_name: string[];
  function: string[];
  password: string;
  phone_number: string;
  horse_company: string | string[];
  agency: string | string[];
  corporate: string | string[];
}

