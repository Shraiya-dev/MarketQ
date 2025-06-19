
import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/sign-in'); // Redirect to sign-in page
  return null; 
}
