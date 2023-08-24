import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import any = jasmine.any;
import axios from "axios";

@Injectable()
export class InstagramService {

  private headers: any
  private base_url:any
  constructor() {
    this.headers = {
      'X-RapidAPI-Key': '730fb05727msh3a0779e4e464396p1f58a0jsnd9e11dfe5370',
      'X-RapidAPI-Host': 'instagram28.p.rapidapi.com'
    }
  }

  async get_media_info(query:string){
    try{
      const response = await axios.get('https://instagram28.p.rapidapi.com/media_info_v2', {
        headers: this.headers,
        params: {
          short_code: query
        }
      })

      return response.data
    }catch(err){
      console.log(err)
      throw new HttpException('Get instagram media error', HttpStatus.BAD_REQUEST)
    }
  }

  async get_like(query:string){
    try{
      const response = await axios.get('https://instagram28.p.rapidapi.com/media_likers', {
        headers: this.headers,
        params: {
          short_code: query
        }
      })

      return response.data
    }catch(err){
      throw new HttpException('Get instagram like error', HttpStatus.BAD_REQUEST)
    }
  }

  async get_comment(query:string){
    try{
      let comments = []
      let next_cursor:any = null

      while (true){
        const response = await axios.get('https://instagram28.p.rapidapi.com/media_comments', {
          headers: this.headers,
          params: {
            short_code: query,
            next_cursor: next_cursor
          }
        })
        next_cursor = response?.data?.data?.shortcode_media?.edge_media_to_parent_comment?.page_info?.end_cursor
        comments.push(response?.data?.data?.shortcode_media?.edge_media_to_parent_comment?.edges)
        if (response.data.data.shortcode_media.edge_media_to_parent_comment.page_info.has_next_page === false){
          break
        }
        continue
      }

      return comments.flat(Infinity)

    }catch (err){
      console.log(err)
      throw new HttpException('Get instagram comment error', HttpStatus.BAD_REQUEST)
    }
  }

  async raffle(userlist:any, property:any){
    try{

      const comment_keyword = property.comment_keyword.split(',')
      const block_keyword = property.block_keyword.split(',')

      const filtered_userlist = userlist.filter((user:any) => {
        const containsCommentKeyword = comment_keyword.some((keyword:any) => user.node.text.includes(keyword))
        const containsBlockKeyword = block_keyword.some((keyword:any) => user.node.owner.username.includes(keyword))

        return containsCommentKeyword && !containsBlockKeyword
      })

      const shuffleArray = [...filtered_userlist].sort(() => Math.random() - 0.5)
      const winners = shuffleArray.slice(0, property.winner_number)
      const spares = shuffleArray.slice(0, property.spares_number)

      const result = {
        winners: winners,
        spares: spares
      }

      return result

    }catch(err){
      console.log(err)
      throw new HttpException('Raffle error', HttpStatus.BAD_REQUEST)
    }
  }

}