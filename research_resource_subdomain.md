# 資源配給與子網域管理研究報告

本報告探討了雲端平台（如 MuchVPS）如何實現動態資源分配（CPU、記憶體、硬碟）以及為使用者提供自動化子網域的技術方案。

---

## 1. 動態資源配給 (Dynamic Resource Allocation)

在 Linux 環境下，資源的隔離與限制主要依賴 **cgroups (Control Groups)** 核心功能。

### CPU 與 記憶體 (Memory)
*   **cgroups**: 這是實作資源限制的底層技術。透過 `cpu.max`（限制使用率）和 `memory.high/max`（限制記憶體量）來確保單一使用者不會耗盡伺服器資源。
*   **Virtualization (KVM/QEMU)**: 真正的 VPS 服務會使用 KVM。它可以透過 `libvirt` 介面動態調整 VCPU 的數值，或使用 **Memory Ballooning** (記憶體氣球技術) 在不重啟的情況下向客端系統「回收」或「借出」記憶體。
*   **Docker/Containers**: 如果 MuchVPS 是基於容器的（類似 Vercel/Render），則可以直接在 `docker run` 或 K8s 中設定 `resources.limits`。

### 硬碟空間 (Disk)
*   **LVM Thin Provisioning**: 使用「精簡配置」的邏輯捲軸 (Logical Volume)。系統預先分配一個大的虛擬空間（例如 50GB），但實際上只佔用寫入的數據量。
*   **Quota**: 透過 Linux 檔案系統的 `quota` 功能或檔案系統層級（如 XFS/EXT4）來強制執行空間限制。

---

## 2. 子網域管理 (Subdomain Management)

為使用者提供 `user1.muchvps.com` 這樣的個人網址，需要以下組件：

### A. Wildcard DNS (萬用字元 DNS)
需要在域名商（如 Cloudflare, Route53）設定一個 A 紀錄：
*   **Name**: `*`
*   **Value**: 您伺服器的公共 IP
這樣任何 `*.muchvps.com` 的請求都會被送到您的伺服器。

### B. 反向代理 (Reverse Proxy) - Nginx / Caddy
伺服器接收到請求後，需要根據 `Host` 標頭判斷要轉發到哪個內部服務：
*   **Nginx**: 可以搭配 Lua 或 OpenResty 從 Redis/Database 即時讀取對應關係。
*   **Caddy**: 原生支援動態配置，且能自動為所有子網域申請 **Let's Encrypt SSL 憑證**（這是目前最推薦的方案）。

---

## 3. MuchVPS 整合建議

為了在我們的專案中實作這些概念，我建議：

### 階段 1：資料模型擴充 (Simulation)
在 `prisma/schema.prisma` 中為 `Service` 增加規格欄位：
```prisma
model Service {
  // ...
  cpuLimit    Int     @default(1) // vCPU cores
  ramLimit    Int     @default(512) // MB
  diskLimit   Int     @default(10) // GB
  subdomain   String? @unique       // 例如: "my-app"
}
```

### 階段 2：資源管理 UI
在「服務設定」中增加一個「資源配額」滑桿，讓使用者可以動態調整並即時看到預估帳單的變化。

### 階段 3：子網域自動生成
當使用者建立服務時，自動根據服務名稱產生一個唯一的子網域名稱，並在 UI 中顯示該 URL。

---

**下一步建議：**
如果您希望我開始「模擬」這些功能（更新資料庫模型與 UI），請告訴我。如果您希望實作「真實」的 Docker/Nginx 介接，我們需要更深入的後端系統權限。
