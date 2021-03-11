# Tim-Translator
提供REST API接口的翻译服务器，中转多个上游翻译服务，方便程序开发
## BasicUsage / 基础用法
1. clone the repositories / 克隆此仓库
2. run `npm install` / 运行`npm install`
3. if you use linux edit the `config.json` and copy it to `/etc/translator/config.json` / 如果你使用的是linux环境，编辑`config.json`并且复制到`/etc/translator/config.json`
4. run `npm start` / 运行`npm start`
5. you can access the default service through `http://localhost:3000/translate/baidu/:srcLang/:destLang/:src` / 你可以访问`http://localhost:3000/translate/baidu/:srcLang/:destLang/:src`获取翻译。
