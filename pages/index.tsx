import styles from '../styles/App.module.css'
import Link from 'next/link'
import type { Flight } from '../types'
import api from '../api'
import { GetStaticProps, NextPage } from 'next'

type Props = {
  origins: Flight["origin"][]
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const origins = await api.origin.list()

  return {
    props: {
      origins
    }
  }
}

const Home: NextPage<Props> = ({origins}) => {

  return (
    <div className={styles.grid}>
    {
      origins.map(origin => (
        <Link key={origin} href={`${origin}`}>
          <a className={styles.card}>
            <h2>{origin} &rarr;</h2>
          </a>
        </Link>
      ))
    }
  </div>
  )
}

export default Home
