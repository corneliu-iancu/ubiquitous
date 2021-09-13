import Head from 'next/head'
import { SITE_PREFERENCES } from '../config/constants'
import { Navigation } from "../components/Navigation"

export default function Market() {
    const pageTitle : string = "Market place";

    return (
      <div>
        <Head>
            <title>{ SITE_PREFERENCES.SITE_TITLE + ' - ' + pageTitle }</title>
        </Head>
        <Navigation items={['Market', 'Mint','Account']} />
        <h2>Market</h2>
      </div>
    )
}