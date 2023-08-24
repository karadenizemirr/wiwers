import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import {secureSession} from 'fastify-secure-session'
@Injectable()
export class LoginInterceptors implements NestInterceptor {
  constructor() {
  }

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const response = context.switchToHttp().getResponse()
    const request = context.switchToHttp().getRequest()
    const session = request.session as secureSession

    let isLogin = false
    if (session && session['token']){
      isLogin = true
    }

    response.locals.isLogin = isLogin
    return next.handle()
  }
}