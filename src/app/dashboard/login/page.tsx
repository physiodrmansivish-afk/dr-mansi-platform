import { Metadata } from 'next';
import LoginForm from './LoginForm';

export const metadata: Metadata = {
  title: 'Doctor Login - Dr. Mansi Vishwakarma',
  description: 'Practice Management Dashboard Login',
};

export default function LoginPage() {
  return <LoginForm />;
}
