import { redirect } from 'next/navigation';

export default function FileAnalysisPage() {
  redirect('/?openChat=true');
}
