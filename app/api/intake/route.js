// This route receives public intake form submissions
// In production, connect this to your database (Supabase recommended)
// For now it logs the submission — wire to DB later

export async function POST(request) {
  try {
    const data = await request.json();
    console.log('New trip request received:', data);
    // TODO: Save to database
    // TODO: Send notification email to justin@qued.com
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: 'Failed to save request' }, { status: 500 });
  }
}
