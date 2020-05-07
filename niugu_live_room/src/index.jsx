import 'babel-polyfill';
import dva from 'dva';
import 'antd/lib/locale-provider/zh_CN';
import routes from './views/router.jsx';
import bindModels from './models';
import './scss/index.scss';

const app = dva();
bindModels(app);

app.router(routes);

app.start('#app');
