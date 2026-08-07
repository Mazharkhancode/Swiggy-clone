const dns = require('dns').promises;

async function test() {
  const resolver = new dns.Resolver();
  resolver.setServers(['8.8.8.8']); // Use Google DNS
  try {
    const srvs = await resolver.resolveSrv('_mongodb._tcp.cluster0.viw0p1b.mongodb.net');
    console.log('SRV records resolved successfully using Google DNS:', srvs);
    try {
      const txt = await resolver.resolveTxt('cluster0.viw0p1b.mongodb.net');
      console.log('TXT records:', txt);
    } catch (e) {
      console.log('No TXT records found:', e.message);
    }
  } catch (err) {
    console.error('Failed to resolve using Google DNS:', err);
  }
}

test();
