import { IsString, Length } from "class-validator";

export class CreatePostDto {
  @IsString()
  @Length(0, 200, { message: 'The text post must be less than 200 characters' })
  text: string;
}
