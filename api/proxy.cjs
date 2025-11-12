const axios = require('axios');

const API_KEY = 'ij9yz7z_fyF1JKN0tagvRw';
const BASE_URL = 'https://api.apollo.io/api/v1';

module.exports = async (req, res) => {
  try {
    // Manually parse body if not auto-parsed
    let body = req.body;
    if (!body) {
      const buffers = [];
      for await (const chunk of req) {
        buffers.push(chunk);
      }
      try {
        body = JSON.parse(Buffer.concat(buffers).toString());
      } catch {
        return res.status(400).json({ error: 'Invalid JSON in request body' });
      }
    }

    const { endpoint, params } = body;

    if (!endpoint) {
      return res.status(400).json({ error: 'Endpoint is required' });
    }

    // Bulk match handling
    if (endpoint === 'people/bulk_match') {
      const queryParams = new URLSearchParams({
        reveal_personal_emails: 'true',
        reveal_phone_number: 'true',
        webhook_url: "https://webhook.site/1234567890",
      });

      const url = `${BASE_URL}/${endpoint}?${queryParams.toString()}`;

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
          },
          body: JSON.stringify({ details: params.details }),
        });

        const text = await response.text();
        try {
          const data = JSON.parse(text);
          return res.status(200).json(data);
        } catch {
          return res.status(502).json({
            error: 'Invalid response from Apollo API',
            details: text.slice(0, 500),
          });
        }
      } catch (fetchError) {
        return res.status(502).json({
          error: 'Failed to connect to Apollo API',
          message: fetchError.message || 'Unknown error',
        });
      }
    }

    // Search endpoints
    if (endpoint.includes('/search')) {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(v => queryParams.append(`${key}[]`, String(v)));
        } else if (value !== null && value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
      queryParams.append('api_key', API_KEY);

      const url = `${BASE_URL}/${endpoint}?${queryParams.toString()}`;

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        return res.status(200).json(data);
      } catch (fetchError) {
        return res.status(502).json({
          error: 'Failed to fetch from Apollo API',
          message: fetchError.message || 'Unknown error',
        });
      }
    }

    // Default: GET request with axios
    const url = `${BASE_URL}/${endpoint}`;
    try {
      const response = await axios.get(url, {
        params: { ...params, api_key: API_KEY },
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      return res.status(200).json(response.data);
    } catch (axiosError) {
      return res.status(axiosError.response?.status || 500).json({
        error: 'Apollo API error',
        details: axiosError.response?.data || axiosError.message,
      });
    }
  } catch (error) {
    console.error('Proxy function error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message || 'An unexpected error occurred',
    });
  }
};
