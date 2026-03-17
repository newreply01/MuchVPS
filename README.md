# MuchVPS Clone Project

這是一個致力於高度復刻 **MuchVPS** 雲端部署平台體驗的現代化 Web 應用程式。

## 🚀 技術架構 (Modern Tech Stack)

*   **前端框架**: Next.js (App Router) - 提供極速的加載與卓越的組件化開發體驗。
*   **樣式佈局**: Tailwind CSS - 靈活且強大的原子級 CSS 框架，支撐起整體的視覺美學。
*   **動畫互動**: Framer Motion - 為 UI 注入靈魂，實現流暢的頁面轉場與狀態過濾動畫。
*   **圖標系統**: Lucide React - 簡潔、一致的現代化圖標集。
*   **主題 切換**: `next-themes` - 原生支持亮色與暗色模式，且默認採用高品質的暗色美學。

## ✨ 核心特色 (Core Features)

1.  **高度還原的 Landing Page**: 包含動態 Hero Section、功能卡片與精緻的導航導覽。
2.  **動態服務市場 (Marketplace)**: 模擬真實的服務分類篩選與快速部署流程。
3.  **現代化控制台 (Dashboard)**:
    *   **項目管理**: 支援實時搜索、環境篩選與項目狀態監控。
    *   **服務詳情**: 包含實時日誌流 (Logs View)、環境變量編輯器、網絡與域名配置。
    *   **GitHub 導入嚮導**: 模擬從 GitHub 倉庫一鍵導入並部署的完整流程。
4.  **MuchVPS AI 助手**: 整合於控制台的對話式部署嚮導，模擬 AI 輔助運維體驗。

## 🛠️ 開發運行指南 (WSL / Ubuntu)

本專案建議在 **WSL (Windows Subsystem for Linux)** 環境下運行，以獲得最佳的 Node.js 兼容性。

### 步驟：

1.  **進入開發環境**:
    ```bash
    wsl -d ubuntu_zb
    cd /home/xg/czb
    ```

2.  **安裝依賴**:
    ```bash
    npm install
    ```

3.  **啟動開發伺服器**:
    ```bash
    npm run dev
    ```

4.  **構建生產版本**:
    ```bash
    npm run build
    ```

## 📂 目錄結構

*   `src/app`: Next.js App Router 頁面路由與佈局。
*   `src/components`: 核心 UI 組件、Dashboard 功能模塊與 AI 助手。
*   `src/lib`: 通用工具函數與配置。
*   `public`: 靜態資源與圖片。

---

*Powered by Antigravity AI @ Google DeepMind.*
