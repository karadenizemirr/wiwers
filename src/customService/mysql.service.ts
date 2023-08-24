import { DataSource } from "typeorm";
import { User } from "../user/user.model";
import { Raffle } from "../raffle/raffle.model";

// export const AppDataSource = new DataSource({
//   type: "mysql",
//   host: "localhost",
//   port: 3306,
//   username: "administrator",
//   password: "123456",
//   database: "Procfile",
//   synchronize: true,
//   logging: true,
//   entities: [User, Raffle],
//   subscribers: [],
//   migrations: [],
// })

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "nuepp3ddzwtnggom.chr7pe7iynqr.eu-west-1.rds.amazonaws.com",
  port: 3306,
  username: "fgdqauk1knb1uzjj",
  password: "s03gsm0jnmoa8pkb",
  database: "cyriso3r7ey8s9qo",
  synchronize: true,
  logging: true,
  entities: [User, Raffle],
  subscribers: [],
  migrations: [],
})