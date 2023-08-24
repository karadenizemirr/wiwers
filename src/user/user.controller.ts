import { Body, Controller, Get, Post, Render, Res, Session } from "@nestjs/common";
import { RegisterInterface } from "../interfaces/register.interface";
import { UserService } from "./user.service";
import { Response } from "express";
import { LoginInterface } from "../interfaces/login.interface";
import * as secureSession from '@fastify/secure-session'
import { JwtService } from "../customService/jwt.service";

@Controller('user')
export class UserController {
  constructor(private readonly userService:UserService, private jwtService: JwtService) {
  }

  // Get Register Page
  @Get('register')
  @Render('user/register')
  async get_register(){
    return {
      title: 'Kayıt Ol'
    }
  }

  // Post Register
  @Post('register')
  async post_register(@Body() body:RegisterInterface, @Res() res:Response){
    try{
      const result = await this.userService.register(body);
      res.redirect(302, '/?register=success')
    }catch (err){
      res.redirect(302, '/user/register?register=error')
    }
  }

  // Login
  @Post('login')
  async post_login(@Body() body:LoginInterface, @Session() session:secureSession.Session, @Res() res:Response){
    try{
      const result = await this.userService.login(body)
      session.set('token', result)
      res.redirect(302, '/?login=success')
    }catch(err){
      res.redirect(302, '/?login=error')
    }
  }

  @Get('logout')
  async get_logout(@Session() session:secureSession.Session, @Res() res:Response){
    session.delete()
    res.redirect(302, '/?logout=success')
  }

  @Get('profile')
  @Render('user/profile')
  async get_profile(@Session() session:secureSession.Session){
    const token = session.get('token')
    let data:any

    if (token){
      const id = this.jwtService.verify_token(token)
      data = await this.userService.get_user(id['id'])
    }
    return {
      title: 'Hesabım',
      data: data
    }
  }
  @Post('profile')
  async post_profile(@Body() bodyData:any, @Res() res:Response){
    try{
      const result = await this.userService.update_profile(bodyData)
      res.redirect(302, '/user/profile?update=success')
    }catch(err){
      res.redirect(302, '/user/profile?update=error')
    }
  }
}