# UTM Tracking Implementation

This document explains how UTM tracking has been implemented in the Gutter Cover Co website.

## Overview

The form now tracks and captures the following UTM parameters:
- `utm_source`: Identifies the source of traffic (e.g., Google, Facebook)
- `utm_medium`: Identifies the medium (e.g., cpc, email, social)
- `utm_campaign`: Identifies the specific campaign (e.g., spring_sale)
- `utm_content`: Identifies the specific content/ad (e.g., banner_ad_1)
- `utm_term`: Identifies the keywords (for paid search)
- `up_source`: Custom parameter for tracking upstream source

## How It Works

1. When a user visits the site with UTM parameters in the URL (e.g., `?utm_source=google&utm_medium=cpc&up_source=partner`), these parameters are captured.
2. The parameters are stored in cookies that last for 30 days.
3. When the user submits the form, all UTM parameters (from either the current URL or from cookies) are included in the form submission.
4. The data is sent to your webhook endpoint with all form data and UTM parameters.

## Configuration

### Webhook URL
To set up the webhook URL, you need to do one of the following:

#### Option 1: Environment Variable
Add the `WEBHOOK_URL` environment variable to your hosting environment.

For local development, create a `.env.local` file in the root directory with:
```
WEBHOOK_URL=https://your-webhook-url.com
```

#### Option 2: Direct Configuration
Edit `src/pages/api/submit-form.js` and replace the webhook URL directly:

```js
const webhookUrl = process.env.WEBHOOK_URL || 'https://your-actual-webhook-url.com';
```

### Google Maps API Key

For the address autocomplete feature to work, you need to set up a Google Maps API key with the Places API enabled.

Add the key to your environment variables:
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## Testing UTM Parameters

To test the UTM parameter tracking, append parameters to your site URL:

```
https://your-site.com/?utm_source=google&utm_medium=cpc&utm_campaign=spring2023&utm_content=ad1&utm_term=gutter+protection&up_source=partner
```

Then submit the form and verify that the webhook receives all the parameters.

## Form Field Mapping

The form field mapping has been updated as requested:
- `name` → Full name
- `phone` → Phone number (formatted as (555) 555-5555)
- `email` → Email address
- `address` → Street address (with Google Places autocomplete)
- `property_type` → Property type
- `issue` → Main gutter issue
- `details` → Additional details

The "City" and "How did you hear about us" fields have been removed as requested. 