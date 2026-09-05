// First-party contribution data: asks GitHub's GraphQL API directly (needs GITHUB_TOKEN in Vercel env).
// Returns the same shape the page already understands: { total: { lastYear }, contributions: [{ date, count, level }] }
const LEVELS = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 };

export default async function handler(req, res) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return res.status(503).json({ error: 'GITHUB_TOKEN not configured' });
  const to = new Date();
  const from = new Date(to); from.setFullYear(from.getFullYear() - 1); from.setDate(from.getDate() + 1);
  const query = `query($login:String!,$from:DateTime!,$to:DateTime!){
    user(login:$login){ contributionsCollection(from:$from,to:$to){
      contributionCalendar{ totalContributions weeks{ contributionDays{ date contributionCount contributionLevel } } } } } }`;
  try {
    const r = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: { authorization: `bearer ${token}`, 'content-type': 'application/json', 'user-agent': 'evitakatrina.info' },
      body: JSON.stringify({ query, variables: { login: 'evitakatrina', from: from.toISOString(), to: to.toISOString() } }),
    });
    const j = await r.json();
    const cal = j?.data?.user?.contributionsCollection?.contributionCalendar;
    if (!cal) return res.status(502).json({ error: 'github', detail: j.errors || null });
    const contributions = cal.weeks.flatMap(w => w.contributionDays)
      .map(d => ({ date: d.date, count: d.contributionCount, level: LEVELS[d.contributionLevel] ?? 0 }));
    res.setHeader('cache-control', 's-maxage=600, stale-while-revalidate=3600');
    res.setHeader('access-control-allow-origin', '*');
    return res.status(200).json({ total: { lastYear: cal.totalContributions }, contributions });
  } catch (e) {
    return res.status(502).json({ error: String(e) });
  }
}
