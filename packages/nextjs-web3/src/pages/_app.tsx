import { useEffect } from 'react'
import TagManager from 'react-gtm-module';

import '../../styles/globals.css'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
	useEffect(() => {
			TagManager.initialize({ gtmId: process.env.NEXT_PUBLIC_GTM_CONTAINER });
	}, []);

	return <Component {...pageProps} />
}
export default MyApp
