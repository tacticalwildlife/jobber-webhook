export default async function handler(req, res) {
  const { name } = req.query;
  
  if (!name) {
    return res.status(400).json({ error: 'Name parameter required' });
  }

  const query = `
    query {
      clients(first: 100) {
        edges {
          node {
            id
            firstName
            lastName
            companyName
            emails { address }
            phones { number }
            clientProperties {
              edges {
                node {
                  address
                  city
                  state
                  postalCode
                }
              }
            }
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
    
    const clients = data.data.clients.edges.filter(e => 
      e.node.firstName.toLowerCase().includes(name.toLowerCase()) ||
      e.node.lastName.toLowerCase().includes(name.toLowerCase())
    );
    
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
