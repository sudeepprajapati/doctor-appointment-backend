import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { HelloModule } from './hello/hello.module';

@Module({
  imports: [HelloModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
