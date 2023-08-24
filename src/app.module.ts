import { Global, Module } from "@nestjs/common";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from "./user/user.module";
import { RaffleModule } from "./raffle/raffle.module";
import { InstagramService } from "./customService/instagram.service";
import { JwtService } from "./customService/jwt.service";
import { LoginInterceptors } from "./interceptors/login.interceptors";

@Global()
@Module({
  imports: [
    UserModule,
    RaffleModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    InstagramService,
    JwtService,
    {
      provide: 'APP_INTERCEPTOR',
      useClass: LoginInterceptors
    }
  ],
  exports: [
    InstagramService,
    JwtService
  ]
})
export class AppModule {}
