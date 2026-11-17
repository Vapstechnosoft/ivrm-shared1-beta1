import { ThemeProvider } from 'next-themes';
import SigninForm from './SigninForm';

export default function Signin() {
    return (
        <ThemeProvider forcedTheme='light'>
            <SigninForm />
        </ThemeProvider>
    );
}
