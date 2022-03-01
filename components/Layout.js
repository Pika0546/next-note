import Head from 'next/head';
import Navbar from './Navbar';

const Layout = ({children}) => {
    return (
        <>
            <Head>
                <title>Notes App</title>
            </Head>

            <Navbar></Navbar>

            {children}
        </>
    );
}

export default Layout;