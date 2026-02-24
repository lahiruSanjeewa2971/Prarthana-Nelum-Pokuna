# Deployment Guide - Prarthana Nelum Pokuna

## 📋 Overview
Complete guide to deploying your Next.js hotel booking application with cost breakdown, step-by-step instructions, and best practices.

---

## 🎯 Recommended Stack

### **Frontend Hosting: Vercel (Best for Next.js)**
- Created by Next.js team
- Zero-config deployment
- Automatic SSL
- Global CDN
- Edge functions support

### **Database: Neon (PostgreSQL)**
- Serverless PostgreSQL
- Generous free tier
- Auto-scaling
- Prisma compatible

### **Media Storage: Cloudinary**
- Free image hosting
- Automatic optimization
- CDN delivery

### **Email: Gmail SMTP (Nodemailer)**
- Uses your existing Gmail account
- Free unlimited emails
- Simple setup with app password
- **Future upgrade:** Resend API for better deliverability

---

## 💰 Cost Breakdown

### **Option 1: Free Tier (Recommended for Launch)**

| Service | Plan | Monthly Cost | Limits |
|---------|------|--------------|--------|
| **Vercel** | Hobby | **$0** | 100GB bandwidth, unlimited sites |
| **Neon** | Free | **$0** | 0.5GB storage (512MB), 10GB data transfer |
| **Cloudinary** | Free | **$0** | 25GB storage, 25GB bandwidth |
| **Email (Gmail)** | Free | **$0** | Unlimited emails via SMTP |
| **Domain** (.com) | - | **$12-15/year** | One-time annual cost |
| **Total** | - | **~$1.25/month** | (domain cost only) |

**Good for:**
- Initial launch and **long-term operation**
- Up to 5,000 monthly visitors
- Testing and validation
- Low-moderate booking volume (<500/month)

**Database Reality Check:**
- Your yearly database size: **~10-15 MB**
- Neon free tier: **512 MB** (50GB with pooling)
- **You can run 30+ years on free tier** before hitting storage limits!

---

### **Option 2: Starter Business ($20-40/month)**

| Service | Plan | Monthly Cost | Features |
|---------|------|--------------|----------|
| **Vercel** | Pro | **$20** | 1TB bandwidth, advanced analytics |
| **Neon** | Free | **$0** | Still plenty of space! |
| **Cloudinary** | Free | **$0** | Still sufficient |
| **Email (Gmail)** | Free | **$0** | SMTP still sufficient |
| **Domain** | - | **$1.25** | Amortized monthly |
| **Total** | - | **$21/month** | For scaling business |

**Good for:**
- 10,000-20,000 monthly visitors
- 500-1,500 bookings/month
- Professional operations with email volume
- Multiple admins

**Note:** Database upgrade **not needed** - your bookings are text-only (tiny!)

---

### **Option 3: Growth Business ($110-140/month)**

| Service | Plan | Monthly Cost | Features |
|---------|------|--------------|----------|
| **Vercel** | Pro | **$20** | Still sufficient |
| **Neon** | Free | **$0** | Still under limits! |
| **Cloudinary** | Plus | **$89** | 90GB storage, 165GB bandwidth |
| **Email** | Resend Pro | **$20** | Professional email API (upgrade) |
| **Monitoring** (Sentry) | **$26** | Error tracking |
| **Domain** | - | **$1.25** | Amortized |
| **Total** | - | **$156/month** | High-volume operations |

**Good for:**
- 50,000+ monthly visitors
- 2,000+ bookings/month
- Heavy image uploads
- Advanced features

**Reality:** Even at 10,000 bookings (10 years), database is only **~25 MB**

---

## 🚀 Deployment Process

### **Phase 1: Pre-Deployment Preparation** (30 minutes)

#### Step 1: Audit Your Code
- [x] All environment variables documented (`.env.example` created)
- [x] No hardcoded secrets in code (all use `process.env`)
- [x] API routes tested locally
- [x] Database migrations ready (4 migrations tested successfully)
- [x] Build succeeds locally (`npm run build` ✓ passed)

#### Step 2: Environment Variables Checklist
Create `.env.production` with:
```
DATABASE_URL=
NEXTAUTH_URL=
NEXTAUTH_SECRET=
JWT_SECRET=
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
FROM_NAME=Prarthana Nelum Pokuna
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

**Status:** ✅ `.env.production` file created
- Update `DATABASE_URL` after Neon setup (Phase 2)
- Generate `NEXTAUTH_SECRET` and `JWT_SECRET` before deployment
- Update `NEXTAUTH_URL` after first Vercel deploy

#### Step 3: Database Preparation
- [ ] Prisma schema finalized
- [ ] Seed data prepared (Hotel, FunctionTypes, Admin)
- [ ] Migration scripts tested
- [ ] Backup strategy defined

**Database Size Reality:**
- Per booking: ~0.6 KB (text-only)
- Yearly estimate: 10-15 MB
- Neon free tier: 512 MB
- **Conclusion:** Free tier sufficient for 30+ years

---

### **Phase 2: Database Setup (Neon)** (15 minutes)

#### Step 1: Create Neon Account
1. Go to [neon.tech](https://neon.tech)
2. Sign up with GitHub (recommended for easy integration)
3. Verify email

#### Step 2: Create Database
1. Click **"Create Project"**
2. Project name: `prarthana-nelum-pokuna-prod`
3. Region: **US East** (or closest to your users)
4. Postgres version: **15** (latest stable)
5. Click **"Create Project"**

#### Step 3: Get Connection String
1. Click **"Connection Details"**
2. Copy **"Connection string"**
3. Format: `postgresql://user:pass@host/dbname?sslmode=require`
4. Save as `DATABASE_URL` for later

#### Step 4: Run Migrations
From your local terminal:
```bash
# Set production database URL temporarily
export DATABASE_URL="<your-neon-connection-string>"

# Run migrations
npx prisma migrate deploy

# Seed database (optional)
npx prisma db seed
```

#### Step 5: Verify Database
1. In Neon dashboard, click **"Tables"**
2. Verify all tables created:
   - `User`
   - `Booking`
   - `FunctionType`
   - etc.

---

### **Phase 3: Vercel Deployment** (20 minutes)

#### Step 1: Push Code to GitHub
```bash
# Initialize git (if not already)
git init
git add .
git commit -m "Initial deployment"

# Create GitHub repo and push
git remote add origin <your-github-repo-url>
git branch -M main
git push -u origin main
```

#### Step 2: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. **Sign up with GitHub** (easiest)
3. Authorize Vercel to access repositories

#### Step 3: Import Project
1. Click **"Add New Project"**
2. Select **"Import Git Repository"**
3. Find `Prarthana-Nelum-Pokuna` repository
4. Click **"Import"**

#### Step 4: Configure Project
**Framework Preset:** Next.js (auto-detected)

**Build Settings:**
- Build Command: `npm run build` (default)
- Output Directory: `.next` (default)
- Install Command: `npm install` (default)

**Root Directory:** `.` (leave as is)

#### Step 5: Add Environment Variables
Click **"Environment Variables"**, add each:

| Key | Value | Source |
|-----|-------|--------|
| `DATABASE_URL` | `<neon-connection-string>` | From Neon dashboard |
| `NEXTAUTH_URL` | `https://your-domain.vercel.app` | Your Vercel URL (update after first deploy) |
| `NEXTAUTH_SECRET` | `<generate-random-32-char>` | Use: `openssl rand -base64 32` |
| `JWT_SECRET` | `<generate-random-32-char>` | Use: `openssl rand -base64 32` |
| `SMTP_HOST` | `smtp.gmail.com` | Gmail SMTP server |
| `SMTP_PORT` | `587` | Standard TLS port |
| `SMTP_USER` | `nelumpokuna@gmail.com` | Your Gmail address |
| `SMTP_PASS` | `<app-specific-password>` | From Gmail settings (see Phase 5) |
| `FROM_NAME` | `Prarthana Nelum Pokuna` | Email sender name |

**For all environments:** Select **Production**, **Preview**, **Development**

#### Step 6: Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes for build
3. See **"Congratulations! 🎉"** message
4. Note your deployment URL: `https://prarthana-nelum-pokuna.vercel.app`

#### Step 7: Update NEXTAUTH_URL
1. Go to **Project Settings** → **Environment Variables**
2. Edit `NEXTAUTH_URL`
3. Change to actual deployment URL
4. **Redeploy** (click "Deployments" → three dots → "Redeploy")

---

### **Phase 4: Custom Domain Setup** (30 minutes)

#### Step 1: Purchase Domain
**Recommended Registrars:**
- **Namecheap** - $12/year, easy interface
- **Google Domains** - $12/year, clean UI
- **Cloudflare** - $9/year, free DNS/CDN

**Domain Suggestions:**
- `prarthananeumpokuna.com` (exact)
- `prarthana.lk` (.lk for Sri Lanka)
- `nelumpokuna.com` (shorter)
- `pnphotel.com` (abbreviated)

#### Step 2: Add Domain to Vercel
1. In Vercel project → **Settings** → **Domains**
2. Enter your domain: `prarthananeumpokuna.com`
3. Click **"Add"**

#### Step 3: Configure DNS
Vercel will show required DNS records:

**For Apex Domain (prarthananeumpokuna.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For WWW (www.prarthananeumpokuna.com):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

#### Step 4: Add Records to Registrar
**In Namecheap/Your Registrar:**
1. Go to **Domain List** → **Manage**
2. Click **Advanced DNS**
3. Add both records above
4. Save changes

#### Step 5: Wait for Propagation
- DNS propagation: 5 minutes - 48 hours (usually < 1 hour)
- Check status: [dnschecker.org](https://dnschecker.org)
- Vercel will auto-issue SSL certificate when DNS is ready

#### Step 6: Verify SSL
- Visit `https://yourdomain.com`
- Check for 🔒 lock icon in browser
- Should auto-redirect HTTP → HTTPS

---

### **Phase 5: Email Setup (Gmail SMTP)** (15 minutes)

#### Step 1: Enable 2-Factor Authentication on Gmail
1. Go to [myaccount.google.com/security](https://myaccount.google.com/security)
2. Sign in with `nelumpokuna@gmail.com` (or your email)
3. Under **"How you sign in to Google"** → Enable **2-Step Verification**
4. Follow prompts to verify your phone number

#### Step 2: Generate App-Specific Password
1. After 2FA is enabled, go back to Security settings
2. Under **"2-Step Verification"** → Scroll down to **"App passwords"**
3. Click **"App passwords"**
4. Select app: **Mail**
5. Select device: **Other (Custom name)**
6. Enter name: `Prarthana Nelum Pokuna Production`
7. Click **"Generate"**
8. **Copy the 16-character password** (shows once!)
9. Example: `abcd efgh ijkl mnop`

#### Step 3: Add to Vercel
1. Vercel → **Project Settings** → **Environment Variables**
2. Add these variables:
   - Key: `SMTP_HOST`, Value: `smtp.gmail.com`
   - Key: `SMTP_PORT`, Value: `587`
   - Key: `SMTP_USER`, Value: `nelumpokuna@gmail.com`
   - Key: `SMTP_PASS`, Value: `<16-char-password>` (no spaces)
   - Key: `FROM_NAME`, Value: `Prarthana Nelum Pokuna`
3. Select **Production**, **Preview**, **Development**
4. Save all

#### Step 4: Redeploy
1. Go to **Deployments** tab
2. Click three dots on latest deployment
3. Click **"Redeploy"**
4. Wait for build to complete

#### Step 5: Test Email Sending
1. Visit your deployed site
2. Create a test booking as customer
3. Check admin email receives notification
4. If issues, check Vercel logs for errors

**⚠️ Important Notes:**
- Gmail limits: **500 emails/day** (plenty for booking system)
- Keep app password secure
- Don't share app password publicly
- If password stops working, generate new one

**🚀 Future Upgrade: Resend API**

For professional operations, consider upgrading to Resend:
- **Why:** Better deliverability, custom domain email (bookings@yourdomain.com)
- **When:** Sending 100+ emails/day or want professional sender
- **Cost:** Free (100/day) or $20/month (50k emails)
- **Setup:** See Phase 5B below

---

### **Phase 5B: Email Upgrade to Resend (Optional - Future)** (20 minutes)

**When you're ready to upgrade from Gmail SMTP:**

#### Step 1: Install Resend Package
```bash
npm install resend
```

#### Step 2: Create Resend Account
1. Go to [resend.com](https://resend.com)
2. Sign up with email
3. Verify email address

#### Step 3: Get API Key
1. Go to **API Keys** section
2. Click **"Create API Key"**
3. Name: `prarthana-production`
4. Permissions: **Sending access**
5. Copy API key (shows once!)

#### Step 4: Update Code to Use Resend
Replace `src/lib/mail.ts` with Resend implementation:
```typescript
import { Resend } from 'resend';
import { logger } from './logger';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  try {
    await resend.emails.send({
      from: `${process.env.FROM_NAME || 'Prarthana Nelum Pokuna'} <bookings@yourdomain.com>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
    
    logger.info(`Email sent successfully to ${options.to}`);
  } catch (error) {
    logger.error('Failed to send email', error);
    throw error;
  }
}
```

#### Step 5: Verify Domain (Recommended)
1. In Resend → **Domains**
2. Add your domain: `prarthananeumpokuna.com`
3. Add DNS records (TXT, MX, CNAME) to your registrar
4. Wait for verification (usually < 1 hour)
5. Now send from `bookings@prarthananeumpokuna.com`

#### Step 6: Update Environment Variables
1. Remove: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
2. Add: `RESEND_API_KEY=re_xxxxx`
3. Redeploy

**Benefits of Resend:**
- ✅ Better deliverability (99%+ inbox rate)
- ✅ Professional sender address
- ✅ Email analytics dashboard
- ✅ Webhook support for tracking
- ✅ No daily limits (free tier: 100/day, Pro: 50k/month)
- ✅ Faster sending (API vs SMTP)

---

### **Phase 6: Media Storage (Cloudinary)** (10 minutes)

#### Step 1: Create Cloudinary Account
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up (free tier)
3. Verify email

#### Step 2: Get Credentials
Dashboard shows:
- **Cloud Name**: `dxxxxxx`
- **API Key**: `123456789012345`
- **API Secret**: `xxxxxx-xxxxxxxxxxx`

#### Step 3: Add to Vercel
Add three environment variables:
1. `CLOUDINARY_CLOUD_NAME`
2. `CLOUDINARY_API_KEY`
3. `CLOUDINARY_API_SECRET`

#### Step 4: Test Upload
1. Go to your deployed site
2. Try uploading image in admin panel
3. Verify image appears in Cloudinary dashboard

---

### **Phase 7: Post-Deployment Verification** (20 minutes)

#### Checklist:

**Frontend:**
- [ ] Homepage loads correctly
- [ ] All navigation links work
- [ ] Images display properly
- [ ] Three.js effects render (navbar parallax, hero particles)
- [ ] Mobile responsive

**Authentication:**
- [ ] Admin login works
- [ ] JWT tokens generated
- [ ] Session persists across pages
- [ ] Logout works

**Booking System:**
- [ ] Customer can create booking
- [ ] Admin receives email notification
- [ ] Booking appears in admin dashboard
- [ ] Admin can approve/reject
- [ ] Customer receives status email

**Database:**
- [ ] Bookings saved correctly
- [ ] Function types load
- [ ] No connection errors in logs

**Performance:**
- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3.5s

---

## 🔧 Advanced Configuration

### **Custom Build Command (Optional)**

If needed, configure in `package.json`:
```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "postinstall": "prisma generate"
  }
}
```

### **Preview Deployments**

Every GitHub pull request automatically gets preview URL:
- Test changes before merging to main
- Share with stakeholders
- No extra cost

### **Automatic Deployments**

Vercel auto-deploys when you push to GitHub:
- Push to `main` → Production deployment
- Push to other branches → Preview deployment
- Rollback available in Vercel dashboard

---

## 📊 Monitoring & Analytics

### **Free Monitoring Tools**

#### 1. Vercel Analytics (Built-in)
- **Cost:** Free on all plans
- **Features:**
  - Page views
  - Top pages
  - Referrer sources
  - Real User Metrics (RUM)

**Setup:** 
1. Vercel Dashboard → Analytics
2. Already enabled by default

#### 2. Google Analytics (Optional)
- **Cost:** Free
- **Features:**
  - Detailed user behavior
  - Conversion tracking
  - Booking funnel analysis

**Setup:**
1. Create GA4 property
2. Add tracking ID to environment variables
3. Install `@next/third-parties/google`

#### 3. Sentry Error Tracking (Optional)
- **Cost:** Free tier (5k errors/month)
- **Features:**
  - Real-time error alerts
  - Stack traces
  - User context

---

## 🔐 Security Checklist

Before going live:

**Environment Variables:**
- [ ] No secrets in code
- [ ] All secrets in Vercel environment variables
- [ ] Different secrets for production vs preview

**Database:**
- [ ] Connection uses SSL (`?sslmode=require`)
- [ ] Database user has minimal permissions
- [ ] Regular backups scheduled (Neon auto-backups on Pro)

**Authentication:**
- [ ] Strong JWT secret (32+ characters)
- [ ] NextAuth secret unique and random
- [ ] Password hashing enabled (bcrypt)
- [ ] Session expiry configured

**API Routes:**
- [ ] Rate limiting implemented (if high traffic)
- [ ] Input validation on all forms
- [ ] CORS configured properly
- [ ] SQL injection prevention (Prisma handles this)

**Headers:**
- [ ] HTTPS enforced (Vercel does this)
- [ ] Security headers configured (CSP, X-Frame-Options)
- [ ] CORS policy set

---

## 📈 Scaling Strategy

### **When to Upgrade:**

**Stay on Free Tier Until:**
- Traffic exceeds 5,000 monthly visitors
- Gmail SMTP working fine (<500 emails/day)
- Don't need professional sender address
- Need advanced Vercel analytics

**Upgrade to Vercel Pro ($20/month) When:**
- 10,000+ monthly visitors
- Need team collaboration
- Want password protection for previews
- Advanced analytics required

**Upgrade to Resend API (Free or $20/month) When:**
- Want professional email (bookings@yourdomain.com)
- Sending 100+ emails/day consistently
- Need email analytics and webhooks
- Want better deliverability rates
- Gmail SMTP having issues

**Database Upgrade?**
- **NOT NEEDED** for hotel booking use case
- Your database will be tiny (~10-15 MB/year)
- Free tier supports **30+ years** of bookings
- Only upgrade if adding features like:
  - Guest photos/albums
  - Document storage
  - Video content

### **Cost Optimization Tips:**

1. **Image Optimization:**
   - Use Next.js Image component (auto-optimized)
   - Compress images before upload
   - Lazy load images below fold

2. **Database Optimization:**
   - Add indexes to frequently queried fields (eventDate, status)
   - Use Prisma connection pooling
   - **No need to archive** - database stays tiny
   - Free tier sufficient for decades

3. **Caching:**
   - Use Next.js ISR (Incremental Static Regeneration)
   - Cache function types list
   - CDN caching for static assets

4. **Email Optimization:**
   - Batch email sends
   - Use templates (reduce HTML size)
   - Only send necessary notifications

---

## 🆘 Troubleshooting

### **Build Fails**

**Error: "Module not found"**
- **Fix:** Run `npm install` locally, commit `package-lock.json`

**Error: "Prisma client not generated"**
- **Fix:** Add `prisma generate` to build command

**Error: "Environment variable missing"**
- **Fix:** Check all required env vars added in Vercel

### **Database Connection Issues**

**Error: "Can't reach database server"**
- **Fix:** Check `DATABASE_URL` format includes `?sslmode=require`

**Error: "Too many connections"**
- **Fix:** Use Prisma connection pooling (add `?connection_limit=5` to URL)

### **Email Not Sending**

**Issue: Emails not received (Gmail SMTP)**
- Check spam/junk folder
- Verify app-specific password is correct (no spaces)
- Ensure 2FA enabled on Gmail account
- Check Gmail account not locked/suspended
- Verify SMTP settings: host=smtp.gmail.com, port=587
- Check Vercel logs for SMTP errors
- Try regenerating app password

**Issue: "Less secure app blocked"**
- Must use app-specific password, not regular password
- Enable 2-Factor Authentication first
- Generate new app password

**Issue: "Daily sending limit exceeded"**
- Gmail limit: 500 emails/day
- Consider upgrading to Resend API (see Phase 5B)

### **Slow Performance**

**Lighthouse score < 70**
- Enable Next.js Image optimization
- Reduce JavaScript bundle (check bundle analyzer)
- Optimize Three.js loading (lazy load)
- Use ISR for static pages

---

## 📅 Maintenance Schedule

### **Daily:**
- Monitor Vercel deployment status
- Check error logs in Sentry (if configured)

### **Weekly:**
- Review booking dashboard
- Check email delivery rates
- Monitor database usage

### **Monthly:**
- Review Vercel analytics
- Check bandwidth usage (unlikely to hit limits)
- Check database size (should be <1 MB/month growth)
- Update dependencies (`npm update`)
- Review and delete old preview deployments

### **Quarterly:**
- Database backup verification
- Security audit
- Performance optimization review
- Cost analysis vs traffic

---

## 💡 Pro Tips

1. **Use Preview Deployments**
   - Test every change on unique URL
   - Share with clients before production
   - Free with Vercel

2. **Enable Automatic Backups**
   - Neon Pro includes daily backups
   - Test restore process once

3. **Set Up Status Page**
   - Use [statuspage.io](https://statuspage.io) (free tier)
   - Auto-notify users of downtime

4. **Add Favicon & Meta Tags**
   - Improves SEO
   - Professional appearance
   - Social media previews

5. **Performance Budget**
   - Set Lighthouse thresholds
   - Fail build if score drops
   - Maintain speed as you add features

6. **A/B Testing**
   - Use Vercel Edge Config
   - Test different CTAs
   - Optimize conversion rates

---

## 📞 Support Resources

### **Vercel:**
- Docs: [vercel.com/docs](https://vercel.com/docs)
- Community: [github.com/vercel/next.js/discussions](https://github.com/vercel/next.js/discussions)
- Support: Premium support on Pro plan

### **Neon:**
- Docs: [neon.tech/docs](https://neon.tech/docs)
- Discord: Active community
- Support: Email support on all plans

### **Next.js:**
- Docs: [nextjs.org/docs](https://nextjs.org/docs)
- Examples: [github.com/vercel/next.js/tree/canary/examples](https://github.com/vercel/next.js/tree/canary/examples)

---

## ✅ Deployment Checklist

### **Pre-Launch:**
- [ ] Code reviewed and tested
- [ ] Database migrations deployed
- [ ] Environment variables configured
- [ ] Custom domain connected
- [ ] SSL certificate active
- [ ] Email sending tested
- [ ] Admin account created
- [ ] Analytics configured

### **Launch Day:**
- [ ] Final deployment to production
- [ ] Smoke test all critical paths
- [ ] Monitor error logs
- [ ] Verify booking flow end-to-end
- [ ] Send test booking email
- [ ] Check mobile responsiveness
- [ ] Share URL with stakeholders

### **Post-Launch:**
- [ ] Set up monitoring alerts
- [ ] Document any issues
- [ ] Gather user feedback
- [ ] Plan first update/improvements

---

## 🎉 Summary

**Recommended Launch Setup:**
- **Platform:** Vercel (Hobby - Free)
- **Database:** Neon (Free tier)
- **Domain:** ~$12/year
- **Email:** Gmail SMTP (Free - unlimited)
- **Total:** ~$1/month

**Optional Future Upgrades:**
- Resend API for professional email (free tier available)

**Timeline:**
- Setup: 2-3 hours
- Testing: 1 hour
- Go-live: Ready same day!

**Next Steps:**
1. Create accounts (Vercel, Neon)
2. Follow Phase-by-phase setup
3. Deploy!
4. Monitor and iterate

**You're ready to launch! 🚀**
