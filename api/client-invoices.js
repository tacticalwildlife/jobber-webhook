export default async function handler(req, res) {
  const { clientId } = req.query;
  
  if (!clientId) {
    return res.status(400).json({ error: 'clientId parameter required' });
  }

  const query = `
    query {
      invoices(first: 50, filter: { clientId: "${clientId}" }) {
        edges {
          node {
            id
            issuedDate
            dueDate
            amount
            lineItems {
              edges {
                node {
                  description
                  quantity
                  unitPrice
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
    
    res.status(200).json(data.data.invoices.edges);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
