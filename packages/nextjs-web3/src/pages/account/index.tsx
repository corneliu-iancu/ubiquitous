import Head from 'next/head'
import { SITE_PREFERENCES } from '../../config/constants'
import { Navigation } from "../../components/Navigation";

export default function Account() {
    const pageTitle : string = "Account";
    return (
      <>
        <Head>
            <title>{ SITE_PREFERENCES.SITE_TITLE + ' - ' + pageTitle }</title>
        </Head>
        <Navigation items={[]} />
        <h2>Account page</h2>
      </>
    )
}