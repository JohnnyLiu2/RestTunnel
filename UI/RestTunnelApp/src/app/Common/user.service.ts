import { Injectable }     from '@angular/core';

@Injectable()
export class UserService {
  userInfo: User;

}

export interface User {
    id: string;
    lastLogonTS: string;
    name: string;
    groups: [string];
    roles: [string];
 }
