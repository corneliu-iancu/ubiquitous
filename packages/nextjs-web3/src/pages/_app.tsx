import { useEffect } from 'react'
import Head  from 'next/head';
import TagManager from 'react-gtm-module';

import '../../styles/globals.css'
import type { AppProps } from 'next/app'
import { SITE_PREFERENCES } from '../config/constants';

function MyApp({ Component, pageProps }: AppProps) {
	useEffect(() => {
		TagManager.initialize({ gtmId: process.env.NEXT_PUBLIC_GTM_CONTAINER || "" });
	}, []);

	return (
		<>
			<Head>
				<meta content={SITE_PREFERENCES.AUTHOR} name="author"/>
				<meta content="width=device-width,initial-scale=1" name="viewport"/>
				<meta content={SITE_PREFERENCES.META_DESCRIPTION} property="description"/>
				<title>{ SITE_PREFERENCES.SITE_TITLE }</title>
			</Head>
			<Component {...pageProps} />
		</>
	)
}
export default MyApp
