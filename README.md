
## 文件目录

  - 入口文件

    ```
    index.js -> 主程序入口

    启动Express程序，启动并连接数据库，路由分发，引入配置
    ```

  - 配置文件

    ```
    np-config.js -> 主程序配置

    数据库配置（程序内部），全局使用（程序内部），其他配置（程序内部），基本信息（API输出）
    ```

  - 数据库

    ```
    np-mongo.js -> 数据库连接启动

    暴露数据库连接方法，以及包装后的mongoose对象
    ```

  - 路由

    ```
    np-routes.js -> 路由控制集合

    ```

  - 控制器

    ```
    np-controller -> 控制器

    ***.controller.js -> 各功能控制器

    ```

  - 数据模型

    ```
    np-model -> 数据模型

    ***.model.js -> 各功能数据模型，映射Mongoose对应的模型方法

    ```

  - 公共解析器

    ```
    np-utils/np-handle.js -> 请求处理器

    handleRequest -> API类型识别器
    handleError -> 控制器失败时解析函数
    handleSuccess -> 控制器成功时解析函数
    ```

  - 权限处理

    ```
    np-utils/np-auth.js -> 权限处理器
    
    权限验证方法，抽象出的对象
    首先会校验jwt的合理性，然后核对加密信息，核对时间戳
    ```


## 接口概述

  - HTTP状态码
    * 401 权限不足
    * 403 权限不足
    * 404 项目中不存在
    * 405 无此方法
    * 500 服务器挂了
    * 200 正常

  - 数据特征码
    * code:
        * 1 正常
        * 0 异常
    * message:
        一般均会返回
    * debug:
        一般会返回错误发生节点的err
        在code为0的时候必须返回，方便调试
    * result:
        一定会返回，若请求为列表数据，一般返回`{ pagenation: {...}, data: {..} }`
        若请求具体数据，如文章，则包含直接数据如`{ title: '', content: ... }`


## 数据结构

  - 通用
    * extend 通用扩展
        文章、分类、tag表都包含extend字段，用于在后台管理中自定义扩展，类似于wordpress中的自定义字段功能，目前用来实现前台icon图标的class或者其他功能
    ···


  - 各种 CRUD 重要字段
    * name         - 名称
    * _id          - mongodb生成的id，一般用于后台执行CRUD操作
    * id           - 插件生成的自增数字id，类似mysql中的id，具有唯一性，用于前台获取数据
    * pid          - 父级ID，用于建立数据表关系，与id字段映射
    ···

  - 数据组成的三种可能
    * 数据库真实存在数据
    * mongoose支持的virtual虚拟数据
    * 计算数据

## Todos & Issues



## 开发命令

```bash
npm install

# 启动开发模式（需全局安装nodemon）
npm run dev

# 生产模式
npm start
pm2 start ecosystem.config.js
```
