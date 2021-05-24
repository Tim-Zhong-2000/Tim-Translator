export namespace USER {
  export interface LoginPayload {
    username: string;
    password: string;
  }

  export interface UserDbItem {
    uid: number;
    email: string;
    phone?: string;
    password: string;
    nickname: string;
    role: Role;
    create_at: string;
    isDelete: boolean;
    friends: string; // JSON.stringify(number[])
    friendreq: string; // JSON.stringify(number[]) 请求队列
    friendres: string; // JSON.stringify(number[]) 接收好友队列
  }

  export interface RegisterPayload {
    nickname: string;
    email: string;
    phone?: string;
    password: string;
  }

  export interface Session {
    uid: number;
    nickname: string;
    email: string;
    phone?: string;
    role: Role;
    friends: { uid: number; nickname: string }[];
    friendreq: { uid: number; nickname: string }[];
    friendres: { uid: number; nickname: string }[];
  }

  export interface Info {
    nickname: string;
    email: string;
    phone?: string;
  }

  /* 数字越大权限越高 */
  export enum Role {
    "guest", // + 下载权限
    "user", // + 发布权限
    "translator", // + 验证权限
    "admin", // + 最高权限
  }

  export enum DBError {
    "NOT_EXIST",
    "AUTH_FAIL",
    "COUNT_TOOMUCH",
    "INTERNAL_ERROR",
    "TYPE_UNSAFE", // 用于初始化sql的变量类型非法
  }

  export enum PrivacyLabel {
    "public",
    "friend",
    "own",
  }
}
