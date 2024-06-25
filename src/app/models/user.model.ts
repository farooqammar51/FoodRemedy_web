export interface UserModel {
    id?: string,
    email: string,
    index?: number,
    refreshTokenId?: string,
    status?: string
}

// export class UserModel {
//     constructor(
//         public id: string, 
//         public email: string,  
//         private _token: string, 
//         private _tokenExpirationTime: number, 
//         public refreshToken: string,
//         public index?: number,) {

//     }

//     get token() {
//         if(!this._tokenExpirationTime || new Date().getTime() > this._tokenExpirationTime) {
//             return null;
//         }
//         return this._token;
//     }
//}