import Head from 'next/head'
import { SITE_PREFERENCES } from '../config/constants'
import { Navigation } from "../components/Navigation"

export default function Mint() {
    const pageTitle : string = "Create your own NFT";
    
    return (
      <div>
        <Head>
            <title>{ SITE_PREFERENCES.SITE_TITLE + ' - ' + pageTitle }</title>
        </Head>
        <Navigation items={['Market', 'Mint','Account']} />
        <h2>Mint</h2>
      </div>
    )
}