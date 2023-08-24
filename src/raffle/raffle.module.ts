import { Module } from "@nestjs/common";
import { RaffleController } from "./raffle.controller";
import { RaffleService } from "./raffle.service";
import { UserService } from "../user/user.service";

@Module({
  controllers: [RaffleController],
  providers: [RaffleService, UserService],
})
export class RaffleModule {}