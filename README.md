# Saolei

一个轻量的扫雷网页小游戏。项目使用纯前端静态文件实现，不需要安装第三方依赖。

## 功能

- 初级、中级、高级三种难度
- 首次点击优先保证点击格及相邻区域无雷；极端高密度棋盘至少保证点击格安全
- 左键翻开格子
- 右键插旗或取消旗子
- 标旗模式按钮，方便触控设备使用
- 自动展开空白区域
- 地雷计数和计时
- 胜利、失败和重新开始

## 本地运行

在仓库目录执行：

```powershell
npm start
```

然后打开：

```text
http://localhost:5173
```

如果不想用 npm，也可以直接执行：

```powershell
python -m http.server 5173
```

## 测试

```powershell
npm test
```

测试使用 Node.js 内置的 `node:test`，不需要额外安装依赖。

## 部署到 GitHub Pages

这个项目是静态网页。推送到 GitHub 后，可以在仓库设置中启用 GitHub Pages：

1. 打开仓库的 `Settings`。
2. 进入 `Pages`。
3. Source 选择 `Deploy from a branch`。
4. Branch 选择 `main`，目录选择 `/root`。
5. 保存后等待 GitHub Pages 构建完成。
