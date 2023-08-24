import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { RegisterInterface } from "../interfaces/register.interface";
import { AppDataSource } from "../customService/mysql.service";
import { User } from "./user.model";
import * as bcrypt from 'bcrypt'
import { LoginInterface } from "../interfaces/login.interface";
import { JwtService } from "../customService/jwt.service";

@Injectable()
export class UserService{
  private userRepository:any

  constructor(private jwtService: JwtService) {
    this.userRepository = AppDataSource.getRepository(User)
  }

  async register(bodyData:RegisterInterface){
    try{
      const control = await this.userRepository.findOne(
        {
          where: {
            email: bodyData.email
          }
        }
      )

      if (!control){
        const user = new User()
        user.name = bodyData.name
        user.surname = bodyData.surname
        user.email = bodyData.email
        user.phone_number = bodyData.phone_number
        user.password = await bcrypt.hash(bodyData.password, 5)
        this.userRepository.save(user)

        return true
      }

      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST)
    }catch (err){
      throw new HttpException('Register error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async login(bodyData:LoginInterface){
    try{
      const control = await this.userRepository.findOne(
        {
          where: {
            email: bodyData.email
          }
        }
      )

      if (control){
        const passwordControl = await bcrypt.compare(bodyData.password, control.password)
        if (passwordControl && control.isActive){
          const token =  this.jwtService.generate_token({id: control.id})
          return token
        }
      }
    }catch(err){
      throw new HttpException('Login error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async get_user(id:string){
    try{
      const data = await this.userRepository.findOne(
        {
          where: {
            id: id
          },
        }
      )
      return data
    }catch(err){
      throw new HttpException('Get User Error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async update_profile(body:any){
    try{
      const user = await this.userRepository.findOne(
        {
          where: {
            id: body.id
          }
        }
      )

      if (user){
        let password = user.password

        if (password !== body.password){
          password = await bcrypt.hash(body.password, 5)
        }

        body.password = password
        await this.userRepository.update(user.id, body)

        return true
      }
    }catch(err){
      throw new HttpException('Update Profile Error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}