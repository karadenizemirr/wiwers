export interface RaffleInterface{
  name: string,
  winner_number: number,
  spares_number: number,
  hashtag_number: number,
  comment_keyword: string,
  block_keyword: string,
  is_like?: boolean,
  is_comment?: boolean,
}