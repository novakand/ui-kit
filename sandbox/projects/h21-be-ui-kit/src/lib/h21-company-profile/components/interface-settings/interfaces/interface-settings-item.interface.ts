export interface IInterfaceSettingsItem {
  settings: IInterfaceSetting[];
  services: InterfaceSettingsService[];
}

export interface IInterfaceSetting {
  companyProfileId: number;
  settingId: number;
  settingCode: string;
  settingName: string;
  settingIsForSearchAndBook: boolean;
  settingIsReadonly: boolean;
  isShow: boolean;
  id: number;
}

export interface InterfaceSettingsService {
  companyProfileId: number;
  serviceTypeId: number;
  isShow: boolean;
  serviceName: string;
  id: number;
}
