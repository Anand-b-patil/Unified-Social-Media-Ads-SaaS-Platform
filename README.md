# 🚀 Unified Social Media Ads SaaS Platform

A complete, production-ready SaaS platform for managing advertising campaigns across multiple social media platforms (Meta, Google Ads, TikTok, LinkedIn) from a single dashboard.

## ✨ Features

- **Multi-Platform Support**: Connect and manage ads on Meta, Google Ads, TikTok, and LinkedIn
- **Campaign Management**: Create, duplicate, and manage campaigns across platforms
- **Media Management**: Upload and manage images/videos for ad campaigns
- **Async Publishing**: Queue-based publishing with automatic retries
- **Real-time Status Tracking**: Live polling updates for campaign status
- **AI-Powered Ad Copy Generation**: Generate and analyze ad copy with mock AI
- **A/B Testing**: Create campaign variants for testing
- **Rate Limiting**: Built-in rate limiting per platform
- **Durable Objects**: Stateful campaign orchestration
- **Responsive UI**: Tailwind CSS-based responsive design

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- Zustand for state management
- SWR for data fetching
- Axios for HTTP requests

**Backend:**
- Cloudflare Workers
- Hono framework
- JavaScript (ES modules)

**Infrastructure:**
- Cloudflare D1 (SQLite database)
- Cloudflare KV (cache & token storage)
- Cloudflare R2 (media storage)
- Cloudflare Queues (async processing)
- Durable Objects (stateful orchestration)

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                      │
│  Login → Dashboard → Create Campaign → Publish → Status    │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ API Requests (with JWT)
                  ▼
┌─────────────────────────────────────────────────────────────┐
│           Backend (Cloudflare Workers + Hono)               │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Routing & Middleware                        │   │
│  │   ├─ Auth Routes (login, signup)                    │   │
│  │   ├─ Campaign Routes                                │   │
│  │   ├─ Platform Routes                                │   │
│  │   ├─ Media Routes                                   │   │
│  │   └─ Publishing Routes                              │   │
│  └──────────────────────────────────────────────────────┘   │
│                      │                                       │
│  ┌──────────────────┼──────────────────────────────────┐    │
│  │         Services & Repositories                     │    │
│  │                  │                                  │    │
│  │  ├─ AuthService ├─ UserRepository ────┐           │    │
│  │  ├─ CampaignService ├─ CampaignRepository ─┐      │    │
│  │  ├─ MediaService ├─ MediaRepository ────────┼─┐   │    │
│  │  ├─ PlatformService ├─ PlatformRepository ──┼─┼─┐ │    │
│  │  ├─ PublishService ├─ JobRepository ────────┼─┼─┼─┤    │
│  │  └─ AIService                               │ │ │ │    │
│  └──────────────────┼──────────────────────────┼─┼─┼─┘    │
│                     │                          │ │ │       │
│  ┌──────────────────┼──────────────────────────┼─┼─┼────┐  │
│  │  Platform Adapters (Factory Pattern)       │ │ │    │  │
│  │  ├─ MetaAdapter                            │ │ │    │  │
│  │  ├─ GoogleAdsAdapter                       │ │ │    │  │
│  │  ├─ TikTokAdapter                          │ │ │    │  │
│  │  └─ LinkedInAdapter                        │ │ │    │  │
│  └──────────────────────────────────────────────┼─┼─┼────┘  │
│                                                  │ │ │       │
└──────────────────────────────────────────────────┼─┼─┼───────┘
                                                    │ │ │
┌──────────────────────────────────────────────────┼─┼─┼───────┐
│          Cloudflare Infrastructure               │ │ │       │
│  ┌────────────────────┐  ┌────────────────────┐  │ │ │       │
│  │  D1 Database       │  │  KV Storage        │  │ │ │       │
│  │  ├─ Users          │  │  ├─ JWT Tokens     │  │ │ │       │
│  │  ├─ Campaigns      │  │  ├─ Cache          │  │ │ │       │
│  │  ├─ Platforms      │  │  └─ Sessions       │  │ │ │       │
│  │  ├─ Media          │  └────────────────────┘  │ │ │       │
│  │  └─ Jobs           │                          │ │ │       │
│  └────────────────────┘  ┌────────────────────┐  │ │ │       │
│  ┌────────────────────┐  │  R2 Bucket         │  │ │ │       │
│  │  Queue Consumer    │  │  └─ Media Files    │  │ │ │       │
│  │  ├─ Publish Jobs   │  └────────────────────┘  │ │ │       │
│  │  ├─ Retry Logic    │  ┌────────────────────┐  │ │ │       │
│  │  └─ Status Updates │  │ Durable Objects    │  │ │ │       │
│  └────────────────────┘  │ ├─ Orchestrator    │◄─┘ │ │       │
│                           │ └─ RateLimiter    │◄───┘ │       │
│                           └────────────────────┘      │       │
└──────────────────────────────────────────────────────┘────────┘
```

## 📁 Project Structure

```
.
├── backend/                          # Cloudflare Workers Backend
│   ├── src/
│   │   ├── index.js                 # Main entry point (Hono app)
│   │   ├── routes/                  # API route handlers
│   │   ├── controllers/             # Business logic controllers
│   │   ├── services/                # Business logic services
│   │   ├── repositories/            # Data access layer
│   │   ├── adapters/                # Platform integrations
│   │   ├── queue/                   # Queue publisher & worker
│   │   ├── durable-objects/         # Orchestrator & RateLimiter
│   │   ├── middleware/              # Auth & error handling
│   │   ├── utils/                   # JWT, DB, KV, validators
│   │   └── migrations/              # Database schema
│   ├── wrangler.toml                # Cloudflare Workers config
│   └── package.json
│
├── frontend/                        # Next.js Frontend
│   ├── app/
│   │   ├── layout.jsx              # Root layout
│   │   ├── page.jsx                # Home page
│   │   ├── auth/                   # Auth pages
│   │   ├── dashboard/              # Dashboard pages
│   │   └── styles/                 # Global styles
│   ├── components/                 # Reusable components
│   ├── services/                   # API & auth services
│   ├── hooks/                      # Custom React hooks
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── shared/                          # Shared utilities
│   ├── constants.js                # Shared constants
│   └── validators.js               # Shared validators
│
└── README.md                        # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Wrangler CLI (`npm install -g wrangler`)
- Cloudflare account

### Backend Setup

1. **Install dependencies**
```bash
cd backend
npm install
```

2. **Configure wrangler.toml**
```toml
# Add your Cloudflare account details
account_id = "your-account-id"
```

3. **Create D1 Database**
```bash
# Create database
wrangler d1 create socialmediaads

# Apply migrations
wrangler d1 migrations apply socialmediaads --file ./src/migrations/schema.sql
```

4. **Set Environment Variables**
```bash
# In wrangler.toml or .dev.vars file
JWT_SECRET=your-secret-key
OPENAI_API_KEY=your-api-key
```

5. **Run Development Server**
```bash
npm run dev
```

### Frontend Setup

1. **Install dependencies**
```bash
cd frontend
npm install
```

2. **Configure Environment**
Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8787
```

3. **Run Development Server**
```bash
npm run dev
```

Visit `http://localhost:3000`

## 🔌 Platform Integration Architecture

### Adapter Pattern

All platform integrations follow the **Adapter Pattern**:

```javascript
class BasePlatformAdapter {
  async authenticate(authCode, redirectUri) { }
  async createAd(payload) { }
  async getStatus(adId) { }
  async deleteAd(adId) { }
  async validateConnection() { }
}

class MetaAdapter extends BasePlatformAdapter {
  // Meta-specific implementation
}
```

### Platform Factory

Dynamically create adapters:

```javascript
const adapter = PlatformFactory.createAdapter('meta', accessToken);
const adResponse = await adapter.createAd(payload);
```

## 📊 Database Schema

### Key Tables

- **users**: User accounts
- **platforms**: Connected platform accounts
- **campaigns**: Ad campaigns
- **campaign_platforms**: Campaign-platform associations
- **media**: Uploaded media files
- **publishing_jobs**: Async publishing jobs

## 🔄 Publishing Flow

1. **User creates campaign** → Stored in D1
2. **User clicks "Publish"** → Creates jobs for each platform
3. **Jobs pushed to Queue** → Cloudflare Queue
4. **Queue Worker processes** → Calls platform adapters
5. **Results stored** → Updated in D1
6. **Status updated** → Frontend polls for updates
7. **Retries handled** → Exponential backoff

## 🧪 Advanced Features Implemented

1. **AI-Generated Ad Copy**: Mock AI service generates variations
2. **Campaign Duplication**: Clone campaigns with one click
3. **Retry Mechanism**: Exponential backoff for failed jobs
4. **Rate Limiting**: Per-platform rate limiting via Durable Objects
5. **Real-time Status**: WebSocket-like polling for live updates

## 🔐 Security

- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Sanitized inputs on all endpoints
- **Rate Limiting**: Per-user limits via Durable Objects
- **Secure Token Storage**: KV with encryption
- **CORS**: Configured for frontend domain

## 🚢 Deployment

### Backend Deployment

```bash
cd backend
npm run deploy:production
```

### Frontend Deployment

Deploy to Vercel:
```bash
cd frontend
vercel deploy --prod
```

Or use your preferred host (Netlify, Cloudflare Pages, etc.)

## 📈 Adding New Platform

1. **Create Adapter**
```javascript
// backend/src/adapters/NewPlatformAdapter.js
class NewPlatformAdapter extends BasePlatformAdapter {
  async authenticate(authCode, redirectUri) { }
  async createAd(payload) { }
  async getStatus(adId) { }
}
module.exports = NewPlatformAdapter;
```

2. **Update Factory**
```javascript
// backend/src/adapters/PlatformFactory.js
case 'new_platform':
  return new NewPlatformAdapter(accessToken, refreshToken);
```

3. **Update Constants**
```javascript
// shared/constants.js
const PLATFORM_TYPE = {
  // ...
  NEW_PLATFORM: 'new_platform',
};
```

4. **Test Integration**
```bash
npm test
```

## 🐛 Debugging

### Backend
```bash
# Enable debug logs
DEBUG=* npm run dev
```

### Frontend
```bash
# Browser DevTools
F12 → Console/Network tabs
```

### Cloudflare
```bash
# View logs
wrangler tail

# View KV storage
wrangler kv:key list --binding=CACHE

# View D1 queries
wrangler d1 execute socialmediaads --command "SELECT * FROM campaigns"
```

## 📝 API Endpoints

### Auth
- `POST /api/auth/signup` - Register
- `POST /api/auth/login` - Login

### Campaigns
- `GET /api/campaigns` - List
- `POST /api/campaigns` - Create
- `GET /api/campaigns/:id` - Get
- `PUT /api/campaigns/:id` - Update
- `DELETE /api/campaigns/:id` - Delete
- `POST /api/campaigns/:id/duplicate` - Duplicate

### Media
- `POST /api/media/upload` - Upload
- `GET /api/media` - List
- `DELETE /api/media/:id` - Delete

### Platforms
- `GET /api/platforms` - List
- `POST /api/platforms/connect` - Connect
- `DELETE /api/platforms/:type` - Disconnect

### Publishing
- `POST /api/publish` - Publish campaign
- `GET /api/status/:campaignId` - Get status

### AI
- `POST /api/ai/generate-copy` - Generate ad copy
- `POST /api/ai/analyze-copy` - Analyze ad copy

## 📚 Documentation

- [Hono Documentation](https://hono.dev)
- [Next.js Documentation](https://nextjs.org/docs)
- [Cloudflare Workers](https://workers.cloudflare.com)
- [D1 Database](https://developers.cloudflare.com/d1)

## 🤝 Contributing

Contributions are welcome! Please follow:
1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit PR

## 📄 License

MIT License - feel free to use this for your projects

## 🎯 Next Steps

- [ ] Add real OAuth2 implementations for platforms
- [ ] Implement WebSockets for real-time updates
- [ ] Add analytics dashboard
- [ ] Implement budget alerts
- [ ] Add campaign performance insights
- [ ] Implement team collaboration
- [ ] Add webhook support

## 🆘 Support

For issues or questions:
1. Check the documentation
2. Review the code comments
3. Check GitHub issues
4. Create a new issue with details

---

Built with ❤️ for managing social media ads at scale.
#   U n i f i e d - S o c i a l - M e d i a - A d s - S a a S - P l a t f o r m  
 