import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { Reflector } from "@nestjs/core";
import { JwtService } from "../customService/jwt.service";
import {secureSession} from 'fastify-secure-session'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()
    const response = context.switchToHttp().getResponse()
    const roles = this.reflector.get<string>('auth', context.getHandler())
    const session = request.session as secureSession

    if (session && session.get('token')) {
      return true
    }
    response.redirect(302, '/?message=login')
    return false
  }
}