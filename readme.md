# KSS

## Getting Started

请严格按照下面说明进行安装。

### Prerequisites

1. 确保你使用的路由器固件是 koolshare。
2. 确保你在路由器后台打开了 ssh。 http://www.asussmart.com/smart/36.html
3. 在路由器后台安装 webshell 插件

### Installing

1. 通过 webshell 插件上传代码仓库中的 my_web_test.sh 文件到/tmp 目录下
2. 在 webshell 中运行 `chmod 700 /tmp/my_web_test.sh` 命令
3. 使用代码仓库下 bin 目录中你操作系统对应平台的执行文件

## Usage

```shell
    # 获取路由器上所有 ss 节点的信息
    # 等号前面的为节点编号
    kss list
```

```shell
    # 对路由器上所有节点进行测速
    # 针对原来的koolshare 脚本，将15秒的等待时间缩短为5秒
    # 该操作耗时极长，请耐心等待
    kss test
```

```shell
    # 输入节点序号，直接切换到该节点
    kss use
```


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

