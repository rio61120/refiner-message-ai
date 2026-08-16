import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { RefineModule } from "@app/refine/refine.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    RefineModule
  ]
})
export class AppModule {}
