export enum userEnum {
  REGISTERED_TYPE_NOT_MATCH_FOR_OTP = 'Register type not match for otp',
  REGISTERED_TYPE_NOT_MATCH_FOR_PASSWORD = 'Register type not match for password',
  REGISTERED = 'Registered successfully',
  LOGIN = 'Login successfully',
  USER_ALREADY_EXIST = 'User Already exist',
  DEACTIVATED_USER = 'Your account has been deactivated.To Activate your account please contact to admin',
  USER_NOT_EXIST = 'User not exist',
  REFERRAL_CODE_NOT_FOUND = 'Referral code not found',
  USER_CREATE_SENT_OTP_ON_YOUR_MOBILE = 'Account has been created. OTP sent to your mobile number.',
  USER_CREATE_SENT_OTP_ON_YOUR_EMAIL = 'Account has been created. OTP sent to your email address.',
  ALREADY_REGISTER_VERIFY_MOBILE = 'OTP has been sent to your mobile number. Please verify the OTP to log in',
  ALREADY_REGISTER_VERIFY_EMAIL = 'OTP has been sent to your email. Please verify the OTP to log in',
  PASSWORD_NOT_SET = 'Password not set',
  DATA_GET = 'Get data',
  INVALID_PASSWORD = 'Invalid password',
  USER_NOT_FOUND = 'User not found',
  PASSWORD_REQUIRED = 'password is required',
  INVALID_TYPE = 'Invalid type',
  SINGLE_USER = 'Single user fetched',
  INVALID_OTP = 'Invalid otp',
  VERIFICATION_COMPLETED = 'OTP has been verified',
  ENTER_EMAIL_PASSWORD = 'Please enter email and mobileNumber',
  PROFILE_UPDATED = 'Profile updated successfully',
  SET_PASSWORD_ALREADY = 'Password already set',
  SET_PASSWORD = 'Password set successfully',
  OTP_RESEND = 'OTP resent successfully',
  WALLET_CONNECT = 'Wallet Connected..',
  USER_LOGGED_IN = 'User loggedIn',
  ACCOUNT_NOT_EXIST = 'Account not exist',
  OTP_NOT_VERIFY = 'OTP_NOT_VERIFY',
  RESET_PASSWORD = 'RESET_PASSWORD',
  SOMETHING_WENT_WRONG = 'SOMETHING_WENT_WRONG',
  EMAIL_ALREADY_EXIST = 'EMAIL_ALREADY_EXIST',
  BANK_DETAILS_UPDATED = 'BANK_DETAILS_UPDATED',
  SET_NOT_PASSWORD = 'SET_NOT_PASSWORD',
  OLD_PASSWORD_WRONG = 'OLD_PASSWORD_WRONG',
  PASSWORD_CHANGED = 'PASSWORD_CHANGED',
  USER_LOGOUT = 'USER_LOGOUT',
  OTP_SENT_TO_BOTH = 'OTP_SENT_TO_BOTH',
  USER_UPDATED = 'USER_UPDATED',
  DATA_NOT_FOUND = 'DATA_NOT_FOUND',
  USER_DEACTIVATED = 'USER_DEACTIVATED',
}

export enum userWalletTypeEnum {
  WEB3MODEL = 'web3model',
  MAGIC = 'magic',
}

export enum userRegisterTypeEnum {
  OTP = 'OTP',
  PASSWORD = 'Password',
}
