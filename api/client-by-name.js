export default async function handler(req, res) {
  const { name } = req.query;
  
  if (!name) {
    return res.status(400).json({ error: 'Name parameter required' });
  }

  const query = `
    query {
      clients(first: 50, filter: { search: "${name}" }) {
        edges {
          node {
            id
            firstName
            lastName
            companyName
            emails { address }
            phones { number }
            addresses { address city state postalCode }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch('https://api.getjobber.com/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.JOBBER_ACCESS_TOKEN,
        'X-JOBBER-GRAPHQL-VERSION': '2026-05-12'
      },
      body: JSON.stringify({ query })
    });

    const data = await response.json();
    
    if (data.errors) {
      return res.status(400).json({ errors: data.errors });
    }
    
    res.status(200).json(data.data.clients.edges);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
