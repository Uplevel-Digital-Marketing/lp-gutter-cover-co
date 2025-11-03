import { z } from 'zod';

// Rate limiting: Simple in-memory store (resets on function restart)
const rateLimitMap = new Map();

// Schema validation
const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100).trim(),
  phone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, 'Phone number must be in format (555) 555-5555'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  address: z.string().min(5, 'Address is too short').max(200).trim(),
  property_type: z.enum(['Single Family', 'Multi Family', 'Condo', 'Commercial'], {
    errorMap: () => ({ message: 'Invalid property type' })
  }),
  issue: z.enum(['Clogging', 'Ice Dams', 'Overflowing', 'Damaged', 'Preventative', 'Other'], {
    errorMap: () => ({ message: 'Invalid issue type' })
  }),
  details: z.string().max(1000).optional().or(z.literal('')),
  utm_source: z.string().max(100).optional().or(z.literal('')),
  utm_medium: z.string().max(100).optional().or(z.literal('')),
  utm_campaign: z.string().max(100).optional().or(z.literal('')),
  utm_content: z.string().max(100).optional().or(z.literal('')),
  utm_term: z.string().max(100).optional().or(z.literal('')),
  up_source: z.string().max(100).optional().or(z.literal('')),
});

// Rate limiting helper (1 request per IP per 3 minutes)
function checkRateLimit(ip) {
  const now = Date.now();
  const windowMs = 3 * 60 * 1000; // 3 minutes

  if (rateLimitMap.has(ip)) {
    const lastRequest = rateLimitMap.get(ip);
    if (now - lastRequest < windowMs) {
      const remainingTime = Math.ceil((windowMs - (now - lastRequest)) / 1000);
      return { allowed: false, remainingTime };
    }
  }

  rateLimitMap.set(ip, now);

  // Cleanup old entries (older than 3 minutes)
  for (const [key, value] of rateLimitMap.entries()) {
    if (now - value > windowMs) {
      rateLimitMap.delete(key);
    }
  }

  return { allowed: true };
}

// Get client IP address
function getClientIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0] ||
         req.headers['x-real-ip'] ||
         req.socket.remoteAddress ||
         'unknown';
}

// API endpoint to handle form submissions and forward data to a webhook
export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get client IP for rate limiting
    const clientIp = getClientIp(req);

    // Check rate limit
    const rateLimit = checkRateLimit(clientIp);
    if (!rateLimit.allowed) {
      return res.status(429).json({
        error: `Please wait ${rateLimit.remainingTime} seconds before submitting again.`,
        field: 'submit'
      });
    }

    // Validate request body size (max 10KB)
    const contentLength = parseInt(req.headers['content-length'] || '0', 10);
    if (contentLength > 10240) {
      return res.status(413).json({ error: 'Request too large', field: 'form' });
    }

    // Validate form data with Zod
    let validatedData;
    try {
      validatedData = formSchema.parse(req.body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        return res.status(400).json({
          error: firstError.message,
          field: firstError.path[0] || 'form'
        });
      }
      throw error;
    }

    // Get webhook URL from environment variable
    const webhookUrl = process.env.WEBHOOK_URL;

    if (!webhookUrl) {
      console.error('[FORM ERROR] Webhook URL not configured');
      return res.status(500).json({ error: 'Service temporarily unavailable. Please try again later.', field: 'submit' });
    }

    // Prepare webhook payload
    const payload = {
      // Form fields (validated)
      name: validatedData.name,
      phone: validatedData.phone,
      email: validatedData.email || '',
      address: validatedData.address,
      property_type: validatedData.property_type,
      issue: validatedData.issue,
      details: validatedData.details || '',

      // Metadata (from environment variables)
      sender: process.env.SENDER_NAME || 'Uplevel',
      activity: process.env.ACTIVITY_TYPE || 'Form',
      client_id: process.env.CLIENT_ID || 'coverco',
      company_id: process.env.COMPANY_ID || 'gutterguard1.com',

      // UTM parameters (validated)
      utm_source: validatedData.utm_source || '',
      utm_medium: validatedData.utm_medium || '',
      utm_campaign: validatedData.utm_campaign || '',
      utm_content: validatedData.utm_content || '',
      utm_term: validatedData.utm_term || '',
      up_source: validatedData.up_source || '',
    };

    // Send data to webhook with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

    try {
      const webhookResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (webhookResponse.ok) {
        // Log successful submission (no user data)
        console.log('[FORM SUCCESS]', {
          timestamp: new Date().toISOString(),
          ip: clientIp,
          utm_source: validatedData.utm_source || 'none',
        });

        return res.status(200).json({ success: true });
      } else {
        // Log webhook error
        console.error('[WEBHOOK ERROR]', {
          status: webhookResponse.status,
          statusText: webhookResponse.statusText,
        });

        return res.status(500).json({
          error: 'Unable to process your submission. Please try again or call us at (440) 336-8092.',
          field: 'submit'
        });
      }
    } catch (fetchError) {
      clearTimeout(timeoutId);

      if (fetchError.name === 'AbortError') {
        console.error('[WEBHOOK TIMEOUT]', { ip: clientIp });
        return res.status(504).json({
          error: 'Request timed out. Please try again.',
          field: 'submit'
        });
      }

      throw fetchError;
    }
  } catch (error) {
    console.error('[FORM ERROR]', {
      error: error.message,
      stack: error.stack,
    });

    return res.status(500).json({
      error: 'An unexpected error occurred. Please try again or call us at (440) 336-8092.',
      field: 'submit'
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10kb',
    },
  },
}; 