import Cookie from 'js-cookie';
// 所有cookie
export const USERINFO = 'USERINFO';
export const LIVEROOMID = 'LIVEROOMID';

/**
 * 清理缓存
 */
export const clearCookie = () => {
  Cookie.remove(USERINFO);
};
