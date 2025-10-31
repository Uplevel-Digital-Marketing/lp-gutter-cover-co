// API endpoint to handle form submissions and forward data to a webhook
export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const formData = req.body;

    // Get webhook URL from environment variable
    const webhookUrl = process.env.WEBHOOK_URL;

    if (!webhookUrl) {
      return res.status(500).json({ error: 'Webhook configuration missing' });
    }

    // Send data to webhook
    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Map form fields to your desired structure
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        property_type: formData.property_type,
        issue: formData.issue,
        details: formData.details,
        sender: 'Uplevel',
        activity: 'Form',
        client_id: 'coverco',
        company_id: 'gutterguard1.com',        
        // UTM parameters
        utm_source: formData.utm_source,
        utm_medium: formData.utm_medium,
        utm_campaign: formData.utm_campaign,
        utm_content: formData.utm_content,
        utm_term: formData.utm_term,
        up_source: formData.up_source,
      }),
    });

    if (webhookResponse.ok) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(500).json({ error: 'Error sending data to webhook' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
} 