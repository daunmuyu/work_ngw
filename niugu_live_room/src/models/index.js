import UserModel from './user.js';
import LoginModel from './login.js';
import ChatRoom from './chat-room.js';
import IM from './IM.js';
import RoleModel from './role.js';
import Bussiness from './bussiness.js';
import Manage from './manage.js';
import Welcome from './welcome.js';
import Intraday from './intraday.js';
import Exercises from './exercises.js';
import Tactics from './tactics.js';
import Strategy from './strategy.js';
import Liveauth from './stock-pool.js';

const bindModels = (dva) => {
  dva.model(UserModel);
  dva.model(LoginModel);
  dva.model(ChatRoom);
  dva.model(IM);
  dva.model(RoleModel);
  dva.model(Bussiness);
  dva.model(Manage);
  dva.model(Welcome);
  dva.model(Intraday);
  dva.model(Exercises);
  dva.model(Tactics);
  dva.model(Strategy);
  dva.model(Liveauth);
};

export default bindModels;
