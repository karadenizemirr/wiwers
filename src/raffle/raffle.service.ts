import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "../customService/jwt.service";
import { UserService } from "../user/user.service";
import { AppDataSource } from "../customService/mysql.service";
import { Raffle } from "./raffle.model";

@Injectable()
export class RaffleService {
  private raffleRepository: any;
  constructor(private jwtService: JwtService, private userSerivce: UserService) {
    this.raffleRepository = AppDataSource.getRepository(Raffle)
  }

  async create_raffle(data:any){
    try{
      // User
      const user_id = this.jwtService.verify_token(data.user)['id']
      const user = await this.userSerivce.get_user(user_id)
      if (user){
        const raffle = new Raffle()
        raffle.name = data.name
        raffle.winner_number = data.winner_number
        raffle.winner_user = data.winner_user
        raffle.spares_number = data.spares_number
        raffle.hashtag_number = data.hashtag_number
        raffle.comment_keyword = data.comment_keyword
        raffle.block_keyword = data.block_keyword
        raffle.is_like = data.is_like
        raffle.is_comment = data.is_comment
        raffle.post_query = data.info.media_query
        raffle.user = user
        await this.raffleRepository.save(raffle)


        return raffle
      }
    }catch (err){
      throw new HttpException('Create raffle error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async get_raffle(id:string){
    try{
      const data = await this.raffleRepository.findOne(
        {
          where: {
            id:id
          },
          relations: {
            user: true
          }
        }
      )

      return data
    }catch(err){
      throw new HttpException('Get raffle error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async get_my_raffle(user_id:string){
    try{
      const data = await this.raffleRepository.find(
        {
          where: {
            user: {
              id: user_id
            }
          },
          relations: {
            user: true
          }
        }
      )

      return data
    }catch(err){
      throw new HttpException('Get my raffle error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async get_update_raffle(data:any){
    try{
      console.log(data)
    }catch(err){
      throw new HttpException('Get update raffle error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}