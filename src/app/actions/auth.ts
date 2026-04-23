'use server';

export async function verifyAdminPassword(password: string) {
  const correctPassword = process.env.ADMIN_PASSWORD || 'admin123';
  if (password === correctPassword) {
    return { success: true };
  }
  return { success: false, error: 'Incorrect password.' };
}
