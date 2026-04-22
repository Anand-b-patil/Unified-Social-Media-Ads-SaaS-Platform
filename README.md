# 🚀 Unified Social Media Ads SaaS Platform

A scalable, production-ready SaaS platform that enables users to create, manage, and publish advertising campaigns across multiple social media platforms (Meta, Google Ads, TikTok, LinkedIn) from a single unified dashboard.

---

## 🌟 Overview

Managing ads across multiple platforms is time-consuming and repetitive. This platform solves that by allowing users to:

- Create ads once
- Publish across multiple platforms
- Track performance in real-time

👉 One dashboard. Multiple platforms. Zero redundancy.

---

## ✨ Key Features

### 🔗 Multi-Platform Integration
- Meta (Facebook & Instagram)
- Google Ads
- TikTok Ads
- LinkedIn Ads

### 📢 Campaign Management
- Create, update, delete campaigns
- Duplicate campaigns instantly
- Manage multiple platform campaigns in one place

### 🖼️ Media Management
- Upload and manage images/videos
- Store media in cloud (Cloudflare R2)

### ⚡ Async Publishing System
- Queue-based publishing
- Automatic retries with exponential backoff
- Fault-tolerant design

### 📊 Real-time Status Tracking
- Live campaign updates via polling
- Track publishing success/failure

### 🤖 AI-Powered Ad Copy
- Generate ad headlines & descriptions
- Analyze effectiveness (mock AI service)

### 🧪 A/B Testing
- Create campaign variations
- Compare performance across versions

### 🚦 Rate Limiting
- Per-platform API rate control using Durable Objects

---

## 🏗️ Architecture

### 🖥️ Frontend
- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- Zustand (state management)
- SWR (data fetching)

### ⚙️ Backend
- Cloudflare Workers
- Hono Framework
- REST API architecture

### ☁️ Cloud Infrastructure (Cloudflare)
- **D1** → Database (SQLite)
- **KV** → Cache & token storage
- **R2** → Media storage
- **Queues** → Async job processing
- **Durable Objects** → State management & rate limiting

---

## 🔄 System Workflow

1. User logs into dashboard
2. Creates a campaign
3. Uploads media
4. Clicks **Publish**
5. Jobs created for each platform
6. Jobs pushed to Queue
7. Worker processes jobs
8. Platform adapters send ads
9. Status updated in database
10. Frontend polls and displays updates

---

## 🔌 Design Pattern Used

### Adapter Pattern

Each platform has a separate adapter:

```js
class BasePlatformAdapter {
  async createAd(payload) {}
  async getStatus(adId) {}
  async deleteAd(adId) {}
}
