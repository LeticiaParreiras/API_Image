import { IsEmail, IsString, Length } from "class-validator"

export class  ChangePasswordforgottenDto{
    @IsEmail()
    email: string

    @IsString()
    @Length(4)
    token: string

    @IsString()
    password:string
}