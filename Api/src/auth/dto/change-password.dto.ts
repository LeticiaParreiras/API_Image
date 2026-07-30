import { IsString, IsStrongPassword, MaxLength } from "class-validator";

export class changePasswordDto{
    @IsString()
    currentPassword: string

    @IsString()
  @IsStrongPassword(
    {},
    {
      message:
        'Password is too weak. Must be 8+ chars with 1 uppercase, 1 lowercase, 1 numbers and 1 symbol.',
    },
  )
  @MaxLength(12, {
    message: 'Password must be less than 12 characters',
  })
    newPassword: string
}