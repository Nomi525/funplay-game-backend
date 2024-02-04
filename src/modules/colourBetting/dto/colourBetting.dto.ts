import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateColourBettingDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  private fullName: string;

  // @ApiProperty({ required: true })
  // @IsString()
  // @IsNotEmpty()
  // email: string;

  // @ApiProperty({ required: true })
  // @IsString()
  // @IsNotEmpty()
  // userName: string;

  // @ApiProperty({ required: true })
  // @IsNumber()
  // @IsNotEmpty()
  // mobileNumber: number;

  // @ApiProperty({ required: false })
  // @IsString()
  // referralCode: string;

  // @ApiProperty({ required: true })
  // @IsNumber()
  // mPin: number;

  // @ApiProperty({ required: false, default: null })
  // @IsString()
  // password: string;

  // @ApiProperty({ default: false })
  // @IsBoolean()
  // isLogin: boolean;

  // @ApiProperty({ default: false })
  // @IsBoolean()
  // isVerified: boolean;

  // @ApiProperty({ default: false })
  // @IsBoolean()
  // resetPasswordAllow: boolean;

  // @ApiProperty({ required: false, default: null })
  // @IsNumber()
  // otp: number;

  // @ApiProperty({ required: false, default: null })
  // @IsNumber()
  // forgotOtp: number;

  // @ApiProperty({ required: false })
  // @IsString()
  // profile: string;

  // @ApiProperty({ required: false })
  // @IsString()
  // address: string;

  // @ApiProperty({
  //   type: 'array',
  //   items: {
  //     type: 'object',
  //     properties: {
  //       walletAddress: { type: 'string' },
  //       walletType: {
  //         type: 'string',
  //         enum: [userWalletTypeEnum.WEB3MODEL, userWalletTypeEnum.MAGIC],
  //       },
  //       isConnected: { type: 'boolean' },
  //     },
  //   },
  //   default: [],
  // })
  // wallet: {
  //   walletAddress: string;
  //   walletType: userWalletTypeEnum.WEB3MODEL | userWalletTypeEnum.MAGIC;
  //   isConnected: boolean;
  // }[];

  // @ApiProperty({ default: 'No' })
  // @IsString()
  // walletConnected: string;

  // @ApiProperty({
  //   type: 'object',
  //   properties: {
  //     bankName: { type: 'string' },
  //     branch: { type: 'string' },
  //     accountHolder: { type: 'string' },
  //     accountNumber: { type: 'number' },
  //     IFSCCode: { type: 'string' },
  //   },
  // })
  // bankDetails: {
  //   bankName: string;
  //   branch: string;
  //   accountHolder: string;
  //   accountNumber: number;
  //   IFSCCode: string;
  // };

  // @ApiProperty({ required: false })
  // @IsString()
  // currency: string;

  // @ApiProperty({
  //   enum: [userRegisterTypeEnum.OTP, userRegisterTypeEnum.PASSWORD],
  //   required: false,
  // })
  // @IsString()
  // registerType: userRegisterTypeEnum.OTP | userRegisterTypeEnum.PASSWORD;

  public getFullName() {
    return this.fullName;
  }
}

export class UpdateColourBettingDto extends CreateColourBettingDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class DeleteColourBettingDto {
  @ApiProperty({ required: false })
  affected?: number | null | undefined;

  @ApiProperty({ required: false })
  raw?: any;
}

// export interface EditProfileUserRequestDto {
//   email: string;
//   profile: string;
//   fullName: string;
//   bankDetails: {
//     bankName?: string;
//     branch?: string;
//     accountHolder?: string;
//     accountNumber?: string;
//     IFSCCode?: string;
//   };
// }

export interface AddColourBettingRequestDto {
  gameId: string;
  colourName: string;
  betAmount: string;
  gameType: string;
  period: string;
  selectedTime: string;
}
export interface ColourBettingBetResultRequestDto {
  gameType: string;
  type: string;
  gameId: string;
  period: number;
}
