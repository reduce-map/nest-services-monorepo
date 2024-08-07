export enum DITokenNames {
  AUTHENTICATION_SERVICE = 'AUTHENTICATION_SERVICE',
  ACCOUNT_USER_SERVICE = 'ACCOUNT_USER_SERVICE',
  ACCOUNT_STEAM_SERVICE = 'ACCOUNT_STEAM_SERVICE',
  PROXY_SERVICE = 'PROXY_SERVICE',
  LOGIN_ATTEMPTS_SERVICE = 'LOGIN_ATTEMPTS_SERVICE',
}

export enum QueueNames {
  AUTH_SERVICE_RPC = 'auth_service_rpc',
  ACCOUNT_USER_SERVICE_RPC = 'account_user_service_rpc',
  ACCOUNT_STEAM_SERVICE_RPC = 'account_steam_service_rpc',
  LOGIN_ATTEMPTS_SERVICE_RPC = 'login_attempts_service_rpc',
  PROXY_SERVICE_RPC = 'proxy_service_rpc',
}

export enum RoutingKeys {
  Login = 'login',
  Logout = 'logout',
  SubmitTFA = 'submit_tfa',
  ValidateJwt = 'validate_jwt',

  Find = 'find',
  FindById = 'find_by_id',
  FindByRange = 'find_by_range',
  FindAll = 'find_all',

  Create = 'create',
  Update = 'update',
  Delete = 'delete',
  GetCount = 'get_count',
}

export enum SteamAccountRoutingKeys {
  AttachProxy = 'attach_proxy',
  SetupDefaultProxy = 'setup_default_proxy',
  RemoveProxies = 'remove_proxies',
  DeattachProxy = 'deattach_proxy',
}

export enum RoutingKeysEntities {
  UserAccount = 'UserAccount',
  SteamAccount = 'SteamAccount',
  LoginAttempt = 'LoginAttempt',
  Proxy = 'Proxy',
}

export enum TFASecretSource {
  TOTP = 'TOTP',
}

export enum LoggerConfigPropertyNames {
  LOG_DESTINATION = 'LOG_DESTINATION',
}
