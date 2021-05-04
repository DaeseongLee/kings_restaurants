import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true,
    }),
    UserModule,
    // CommonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
