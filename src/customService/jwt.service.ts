import { Injectable } from "@nestjs/common";
import * as jwt from 'jsonwebtoken'
@Injectable()
export class JwtService {
  private token = "Xwiwers2023"

  constructor() {
  }

  generate_token(payload:any){
    return jwt.sign(payload, this.token)
  }

  verify_token(token:string){
    return jwt.verify(token, this.token)
  }
}