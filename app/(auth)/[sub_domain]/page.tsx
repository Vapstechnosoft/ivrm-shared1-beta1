import { ThemeProvider } from 'next-themes';
import SigninForm from '../sign-in/SigninForm';

export default function Page() {
    return (
        <ThemeProvider forcedTheme='light'>
            <SigninForm />
        </ThemeProvider>
    );
}
