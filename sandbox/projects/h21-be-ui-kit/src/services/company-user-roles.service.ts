export class CompanyUserRoleService {

  private static _horseRoles = [
    { code: 'admin', name: 'Admin', description: null, id: 1 },
    { code: 'booker', name: 'Booker', description: null, id: 2 },
    { code: 'SB', name: 'Selfbooker', description: null, id: 3 },
    { code: 'HM', name: 'Horse manager', description: null, id: 4 },
    { code: 'HO', name: 'Horse operator', description: null, id: 5 },
  ];

  private static _agencyRoles = [
    { code: 'admin', name: 'Admin', description: null, id: 1 },
    { code: 'booker', name: 'Booker', description: null, id: 2 },
    { code: 'SB', name: 'Selfbooker', description: null, id: 3 },
  ];

  public static getRoles(typeId: number) {
    const agencyTypes = [ 3, 4, 6 ];

    if (agencyTypes.includes(typeId)) {
      return this._agencyRoles;
    }
    return this._horseRoles;
  }

}
