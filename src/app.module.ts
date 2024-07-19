import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthAdmin } from './guard/auth/auth.admin.guard';
import { AuthUser } from './guard/auth/auth.user.guard';
import { IsAuthenticatedMiddleware } from './is-authenticated/is-authenticated.middleware';
import { SchemaModule } from './schema/schema.module';

@Module({
  imports: [SchemaModule, EventEmitterModule.forRoot(), ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, AuthAdmin, AuthUser],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IsAuthenticatedMiddleware).exclude('/schema/get-date').forRoutes('*');
  }
}
