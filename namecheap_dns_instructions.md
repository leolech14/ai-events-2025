# Namecheap DNS Configuration for finally.gold

## Quick Setup Instructions

### 1. Log in to Namecheap
- Go to https://www.namecheap.com
- Sign in to your account

### 2. Navigate to DNS Management
- Go to **Domain List** in your dashboard
- Find **finally.gold**
- Click **Manage** button
- Select **Advanced DNS** tab

### 3. Delete Conflicting Records
Remove any existing records with these configurations:
- Delete all **A Records** with Host = "@" 
- Delete all **CNAME Records** with Host = "www"

### 4. Add GitHub Pages DNS Records

Click **ADD NEW RECORD** and create these exact records:

#### A Records (for apex domain finally.gold):
| Type | Host | Value | TTL |
|------|------|-------|-----|
| A Record | @ | 185.199.108.153 | 1 min |
| A Record | @ | 185.199.109.153 | 1 min |
| A Record | @ | 185.199.110.153 | 1 min |
| A Record | @ | 185.199.111.153 | 1 min |

#### CNAME Record (for www subdomain):
| Type | Host | Value | TTL |
|------|------|-------|-----|
| CNAME Record | www | leolech14.github.io | 1 min |

### 5. Save Changes
- Click **Save All Changes** button
- Confirm the changes when prompted

## Verification Commands

After saving, verify the DNS configuration (may take 1-5 minutes to propagate):

```bash
# Check A records
dig finally.gold +short

# Check CNAME record  
dig www.finally.gold +short

# Alternative check
nslookup finally.gold
nslookup www.finally.gold
```

## Expected Results

- `finally.gold` should return:
  - 185.199.108.153
  - 185.199.109.153
  - 185.199.110.153
  - 185.199.111.153

- `www.finally.gold` should return:
  - leolech14.github.io

## GitHub Pages Configuration

Ensure your GitHub repository has:
1. A file named `CNAME` in the root with content: `finally.gold`
2. GitHub Pages enabled in Settings → Pages
3. Source set to deploy from branch (main/master)

## Website Access

Once configured, your site will be accessible at:
- https://finally.gold
- https://www.finally.gold

Both will serve content from: https://leolech14.github.io/ai-events-2025/

## TTL Note
The 1-minute TTL (60 seconds) ensures quick DNS propagation for testing and changes. This is the minimum TTL allowed by Namecheap.

## Troubleshooting

If the site doesn't work after DNS propagation:
1. Check GitHub Pages status: https://github.com/leolech14/ai-events-2025/settings/pages
2. Verify CNAME file exists in repository root
3. Clear browser cache and try incognito/private mode
4. Wait up to 10 minutes for full propagation with 1-minute TTL