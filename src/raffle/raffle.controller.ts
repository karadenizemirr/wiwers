import { Body, Controller, Get, Param, Post, Render, Res, Session, UseGuards } from "@nestjs/common";
import { InstagramService } from "../customService/instagram.service";
import * as secureSession from "@fastify/secure-session";
import { RaffleInterface } from "../interfaces/raffle.interface";
import { RaffleService } from "./raffle.service";
import { Response } from "express";
import { JwtService } from "../customService/jwt.service";
import { Auth } from "../auth/auth.declator";
import { AuthGuard } from "../auth/auth.guard";

@Controller('raffle')
export class RaffleController {
  constructor(private readonly instagramService: InstagramService, private raffleService: RaffleService, private jwtService: JwtService) {
  }

  @UseGuards(AuthGuard)
  @Auth('user')
  @Get('/:site?')
  @Render('user/raffle/index')
  async get_raffle(@Param('site') site: string, @Session() session:secureSession.Session) {
    const media_info = await this.instagramService.get_media_info(site)

    const info = {
      user: {
        username: media_info?.items[0]?.user?.username,
        full_name: media_info?.items[0]?.user?.full_name,
      },
      image: media_info?.items[0]?.image_versions2?.candidates[0]?.url,
      comment_count: media_info?.items[0]?.comment_count,
      like_count: media_info?.items[0]?.like_count,
      media_query: site
    }
    session.set('instagram', info)
    return {
      title: 'Çekiliş Yap',
      info: info,
    }
  }
  @UseGuards(AuthGuard)
  @Auth('user')
  @Post('create')
  async post_create_raffle(@Session() session:secureSession.Session, @Body() body:RaffleInterface, @Res() response:Response) {
    const info = session.get('instagram')
    const user = session.get('token')
    const req_data = {
      ...body,info,user
    }
    const raffle = await this.raffleService.create_raffle(req_data)
    response.redirect(302, '/raffle/start/' + raffle?.id)
  }

  @Get('start/:id')
  @Render('user/raffle/start')
  async get_start_raffle_page(@Param('id') id:string){
    return {
      title: 'Çekiliş Başlat',
    }
  }

@Get('raffleStart/:id')
@UseGuards(AuthGuard)
@Auth('user')
async get_start_raffle(@Body() body:RaffleInterface, @Param('id') id:string, @Res() response:Response){
  const raffle = await this.raffleService.get_raffle(id)
  let winner:any
  const media_info = await this.instagramService.get_media_info(raffle.post_query)

  if (raffle.is_like !== null){
    const likes = await this.instagramService.get_like(raffle.post_query)
  }else if (raffle.is_comment !== null){
    const comments = await this.instagramService.get_comment(raffle.post_query)
    winner = await this.instagramService.raffle(comments, raffle)
  }

  response.status(200).send({
    raffle: raffle,
    winner: winner,
    media_info: media_info
  })
}

  @UseGuards(AuthGuard)
  @Auth('user')
  @Get('my')
  @Render('user/raffle/list')
  async get_raffles(@Session() session:secureSession.Session){
    const token = session.get('token')
    let data:any

    if (token){
      const user_id = this.jwtService.verify_token(token)['id']
      data = await this.raffleService.get_my_raffle(user_id)
    }

    return {
      title: 'Çekilişlerim',
      data:data
    }
  }
}