import { IsEmail, IsString, Length } from "class-validator"

export class  VerifyTokenResetPasswordDto{
    @IsEmail()
    email: string

    @IsString()
    @Length(4)
    token: string
}