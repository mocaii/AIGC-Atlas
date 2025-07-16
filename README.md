# AIGC 应用全景图谱

一个基于 React + Vite 构建的AIGC 应用展示平台，提供全面的人工智能应用分类和搜索功能。

## 🚀 功能特性

- 📱 响应式设计，支持多设备访问
- 🔍 实时搜索功能，支持应用名称模糊匹配
- 📊 多层级分类展示，清晰的数据结构
- ⚡ 基于 Vite 的快速开发和构建
- 🎨 现代化 UI 设计

## 🛠️ 技术栈

- **前端框架**: React 19
- **构建工具**: Vite 6
- **代码规范**: ESLint + Prettier
- **样式**: CSS3
- **数据**: JSON 静态数据

## 📦 安装和运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview

# 代码检查
npm run lint

# 代码格式化
npm run format
```

## 📁 项目结构

```
src/
├── components/          # React 组件
├── data/               # 静态数据文件
├── hooks/              # 自定义 Hooks
├── styles/             # 样式文件
├── utils/              # 工具函数
├── App.jsx             # 主应用组件
└── main.jsx            # 应用入口
```

## 🔧 开发指南

### 添加新的应用数据
1. 编辑 `src/data/applications_info_updated.json`
2. 按照现有数据结构添加新的应用信息
3. 重启开发服务器查看效果

### 自定义样式
- 主要样式文件位于 `src/styles/` 目录
- 组件样式采用 CSS Modules 或普通 CSS

### 性能优化建议
- 大数据集建议使用虚拟化列表
- 搜索功能已集成防抖处理
- 考虑实现懒加载和分页

## 📝 待办事项

- [ ] 迁移到 TypeScript
- [ ] 添加单元测试
- [ ] 实现数据可视化图表
- [ ] 添加应用详情页面
- [ ] 集成后端 API
- [ ] 添加用户收藏功能

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📊 数据来源

数据来源：量子位智库 (仅用于示例展示)
