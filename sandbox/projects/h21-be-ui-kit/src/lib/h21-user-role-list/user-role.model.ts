export class UserRole {

   public jobTitle?: string;
   public userProfileId?: number;
   public roleId?: number;
   public horseCompanyId?: number;
   public agencyProfileId?: number;
   public corporateProfileId?: number;
   public createDate?: Date;
   public createUserName?: string;
   public updateDate?: Date;
   public updateUserName?: string;
   public id?: number;

   constructor(obj?: Partial<UserRole>) {
     Object.assign(this, obj);
   }

}
