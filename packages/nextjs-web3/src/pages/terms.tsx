import Head from 'next/head'
import { SITE_PREFERENCES } from '../config/constants'
import { Navigation } from "../components/Navigation"

// Serves terms and conditions page.
export default function TermsAndConditions() {
    const pageTitle : string = "Terms and conditions";
    return (
      <div>
        <Head>
            <title>{ SITE_PREFERENCES.SITE_TITLE + ' - ' + pageTitle }</title>
        </Head>
        <Navigation items={['Market', 'Mint', 'Terms','Account']} />
        <h2>Account received offers</h2>
      </div>
    )
}